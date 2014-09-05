// Inline lexer

'use strict';


////////////////////////////////////////////////////////////////////////////////
// Lexer rules

var rules = [];


// Pure text
rules.push(function text(state, begin, end) {
  state.tokens.push({
    type: 'text',
    begin: begin,
    end: end
  });

  state.pos = end;
  return true;
});


////////////////////////////////////////////////////////////////////////////////
// Lexer class


function findByName(self, name) {
  for (var i = 0; i < self.rules.length; i++) {
    if (self.rules[i].name === name) {
      return i;
    }
  }
  return -1;
}


// Block Lexer class
//
function LexerInline() {
  this.rules = [];

  for (var i = 0; i < rules.length; i++) {
    this.after(null, rules[i]);
  }
}


// Replace/delete lexer function
//
LexerInline.prototype.at = function (name, fn) {
  var index = findByName(name);
  if (index === -1) {
    throw new Error('Lexer rule not found: ' + name);
  }

  if (fn) {
    this.rules[index] = fn;
  } else {
    this.rules = this.rules.slice(0, index).concat(this.rules.slice(index + 1));
  }
};


// Add function to lexer chain before one with given name.
// Or add to start, if name not defined
//
LexerInline.prototype.before = function (name, fn) {
  if (!name) {
    this.rules.unshift(fn);
    return;
  }

  var index = findByName(name);
  if (index === -1) {
    throw new Error('Lexer rule not found: ' + name);
  }

  this.rules.splice(index, 0, fn);
};


// Add function to lexer chain after one with given name.
// Or add to end, if name not defined
//
LexerInline.prototype.after = function (name, fn) {
  if (!name) {
    this.rules.push(fn);
    return;
  }

  var index = findByName(name);
  if (index === -1) {
    throw new Error('Lexer rule not found: ' + name);
  }

  this.rules.splice(index + 1, 0, fn);
};


// Generate tokens for input range
//
LexerInline.prototype.tokenize = function (state, begin, end) {
  var ok, i,
      rules = this.rules,
      len = this.rules.length,
      pos = begin;

  while (pos < end) {

    // Try all possible rules.
    // On success, rule should:
    //
    // - update `state.pos`
    // - update `state.tokens`
    // - return true

    for (i = 0; i < len; i++) {
      ok = rules[i](state, pos, end);
      if (ok) { break; }
    }

    if (ok) {
      pos = state.pos;
      continue;
    }
  }

  state.pos = end;
};


module.exports = LexerInline;
