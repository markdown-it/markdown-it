// Block lexer


'use strict';


var isEmpty = require('./helpers').isEmpty;
var skipEmptyLines  = require('./helpers').skipEmptyLines;


var rules = [];

// `list` should be after `hr`, but before `heading`
rules.push(require('./lexer_block/code'));
rules.push(require('./lexer_block/fences'));
rules.push(require('./lexer_block/hr'));
rules.push(require('./lexer_block/list'));
rules.push(require('./lexer_block/heading'));
rules.push(require('./lexer_block/lheading'));
rules.push(require('./lexer_block/blockquote'));
rules.push(require('./lexer_block/table'));
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

  for (;;) {
    line = state.line = skipEmptyLines(state, line, endLine);
    if (line >= endLine) { break; }

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

    if (!ok) { throw new Error('No matching rules found'); }

    if (line >= state.line) {
      throw new Error("Parser didn't update state.line");
    }

    line = state.line;
    if (isEmpty(state, line)) {
      line++;

      // two empty lines should stop the parser
      if (isEmpty(state, line + 1)) { break; }
    }
  }
};


module.exports = LexerBlock;
