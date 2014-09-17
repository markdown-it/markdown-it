// Inline lexer

'use strict';


var StateInline = require('./lexer_inline/state_inline');

////////////////////////////////////////////////////////////////////////////////
// Lexer rules

var rules = [];


// Pure text
rules.push(require('./lexer_inline/text'));
rules.push(require('./lexer_inline/newline'));
rules.push(require('./lexer_inline/escape'));
rules.push(require('./lexer_inline/backticks'));
//
//
rules.push(require('./lexer_inline/autolink'));
rules.push(require('./lexer_inline/htmltag'));
rules.push(require('./lexer_inline/entity'));
rules.push(require('./lexer_inline/escape_html_char'));


////////////////////////////////////////////////////////////////////////////////
// Lexer class


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
function LexerInline() {
  this.rules = [];

  // Rule to skip pure text
  // - '{$%@' reserved for extentions
  // - '<>"' added for internal html escaping
  this.textMatch = /^[^\n\\`*_\[!&{$%@<>"]+/;

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
LexerInline.prototype.tokenize = function (state) {
  var ok, i,
      rules = this.rules,
      len = this.rules.length,
      end = state.src.length;

  while (state.pos < end) {

    // Try all possible rules.
    // On success, rule should:
    //
    // - update `state.pos`
    // - update `state.tokens`
    // - return true

    for (i = 0; i < len; i++) {
      ok = rules[i](state);
      if (ok) { break; }
    }

    if (ok) {
      if (state.pos >= end) { break; }
      continue;
    }

    state.pending += state.src[state.pos++];
  }

  if (state.pending) {
    state.pushPending();
  }

  return state.tokens;
};

// Parse input string.
//
LexerInline.prototype.parse = function (str, options) {
  var state = new StateInline(str, this, options);

  this.tokenize(state);

  return state.tokens;
};


module.exports = LexerInline;
