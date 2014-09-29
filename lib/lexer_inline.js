// Inline lexer

'use strict';


var StateInline = require('./lexer_inline/state_inline');
var links = require('./lexer_inline/links');
var skipSpaces = require('./helpers').skipSpaces;

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
rules.push(require('./lexer_inline/emphasis'));
rules.push(require('./lexer_inline/links'));
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
  // - '{$%@}' reserved for extentions
  // - '<>"' added for internal html escaping
  this.textMatch = /^[^\n\\`*_\[\]!&{}$%@<>"]+/;

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
      end = state.posMax;

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
LexerInline.prototype.parse = function (str, options, env) {
  var state = new StateInline(str, this, options, env);

  this.tokenize(state);

  return state.tokens;
};

// Parse link reference definition.
//
LexerInline.prototype.parse_reference = function (str, options) {
  var state, labelEnd, pos, max, code, start, href, title;

  if (str.charCodeAt(0) !== 0x5B/* [ */) { return null; }

  state = new StateInline(str, this, options);
  labelEnd = links.parseLinkLabel(state, 0);

  if (labelEnd < 0 || str.charCodeAt(labelEnd + 1) !== 0x3A/* : */) { return null; }

  max = state.posMax;

  // [label]:   destination   'title'
  //         ^^^ skip optional whitespace here
  for (pos = labelEnd + 2; pos < max; pos++) {
    code = state.src.charCodeAt(pos);
    if (code !== 0x20 && code !== 0x0A) { break; }
  }

  // [label]:   destination   'title'
  //            ^^^^^^^^^^^ parse this
  href = links.parseLinkDestination(state, pos);
  if (href === null) { return null; }
  pos = state.pos;

  // [label]:   destination   'title'
  //                       ^^^ skipping those spaces
  start = pos;
  for (pos = pos + 1; pos < max; pos++) {
    code = state.src.charCodeAt(pos);
    if (code !== 0x20 && code !== 0x0A) { break; }
  }

  // [label]:   destination   'title'
  //                          ^^^^^^^ parse this
  if (pos < max && start !== pos && (title = links.parseLinkTitle(state, pos)) !== null) {
    pos = state.pos;
  } else {
    title = '';
  }

  // ensure that the end of the line is empty
  pos = skipSpaces(state, pos);
  if (pos < max && state.src.charCodeAt(pos) !== 0x0A) { return null; }

  return {
    label: links.normalizeReference(str.slice(1, labelEnd)),
    title: title,
    href: href,
    remaining: str.slice(pos)
  };
};


module.exports = LexerInline;
