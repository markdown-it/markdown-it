// Block lexer


'use strict';


var rules = [];

rules.push(require('./lexer_block/code'));
rules.push(require('./lexer_block/fences'));
rules.push(require('./lexer_block/heading'));
rules.push(require('./lexer_block/lheading'));
rules.push(require('./lexer_block/hr'));
rules.push(require('./lexer_block/paragraph'));


function functionName(fn) {
  var ret = fn.toString();
  ret = ret.substr('function '.length);
  ret = ret.substr(0, ret.indexOf('('));
  return ret;
}

function findByName(self, name) {
  for (var i = 0; i < self.rules.length; i++) {
    if (functionName(self.rules[i]) === name) {
      return i;
    }
  }
  return -1;
}


// Block Lexer class
//
function LexerBlock() {
  this.rules = [];
  this.rules_named = {};

  for (var i = 0; i < rules.length; i++) {
    this.after(null, rules[i]);
  }
}


// Replace/delete lexer function
//
LexerBlock.prototype.at = function (name, fn) {
  var index = findByName(name);
  if (index === -1) {
    throw new Error('Lexer rule not found: ' + name);
  }

  if (fn) {
    this.rules[index] = fn;
  } else {
    this.rules = this.rules.slice(0, index).concat(this.rules.slice(index + 1));
  }

  this.rules_named[functionName(fn)] = fn;
};


// Add function to lexer chain before one with given name.
// Or add to start, if name not defined
//
LexerBlock.prototype.before = function (name, fn) {
  if (!name) {
    this.rules.unshift(fn);
    this.rules_named[functionName(fn)] = fn;
    return;
  }

  var index = findByName(name);
  if (index === -1) {
    throw new Error('Lexer rule not found: ' + name);
  }

  this.rules.splice(index, 0, fn);
  this.rules_named[functionName(fn)] = fn;
};


// Add function to lexer chain after one with given name.
// Or add to end, if name not defined
//
LexerBlock.prototype.after = function (name, fn) {
  if (!name) {
    this.rules.push(fn);
    this.rules_named[functionName(fn)] = fn;
    return;
  }

  var index = findByName(name);
  if (index === -1) {
    throw new Error('Lexer rule not found: ' + name);
  }

  this.rules.splice(index + 1, 0, fn);
  this.rules_named[functionName(fn)] = fn;
};


// Generate tokens for input range
//
LexerBlock.prototype.tokenize = function (state, startLine, endLine) {
  var ok, i,
      rules = this.rules,
      len = this.rules.length,
      line = startLine;

  while (line < endLine) {

    // Try all possible rules.
    // On success, rule should:
    //
    // - update `state.pos`
    // - update `state.tokens`
    // - return true

    for (i = 0; i < len; i++) {
      ok = rules[i](state, line, endLine, false);
      if (ok) { break; }
    }

    if (ok) {
      line = state.line;
      continue;
    }
  }
};


module.exports = LexerBlock;
