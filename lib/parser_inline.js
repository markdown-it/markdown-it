// Inline parser

'use strict';


var Ruler       = require('./ruler');
var StateInline = require('./rules_inline/state_inline');

////////////////////////////////////////////////////////////////////////////////
// Parser rules

var rules = [];


// Pure text
rules.push(require('./rules_inline/text'));
rules.push(require('./rules_inline/newline'));
rules.push(require('./rules_inline/escape'));
rules.push(require('./rules_inline/backticks'));
rules.push(require('./rules_inline/emphasis'));
rules.push(require('./rules_inline/links'));
rules.push(require('./rules_inline/autolink'));
rules.push(require('./rules_inline/htmltag'));
rules.push(require('./rules_inline/entity'));
rules.push(require('./rules_inline/escape_html_char'));


// Inline Parser class
//
function ParserInline() {
  this._rules = [];

  // Rule to skip pure text
  // - '{$%@}' reserved for extentions
  // - '<>"' added for internal html escaping
  this.textMatch = /^[^\n\\`*_\[\]!&{}$%@<>"]+/;

  this.ruler = new Ruler(this.rulesUpdate.bind(this));

  for (var i = 0; i < rules.length; i++) {
    this.ruler.after(rules[i]);
  }
}


ParserInline.prototype.rulesUpdate = function () {
  this._rules = this.ruler.getRules();
};


// Generate single token;
// returns `true` if any rule reported success
//
ParserInline.prototype.tokenizeSingle = function (state) {
  var ok, i,
      rules = this._rules,
      len = this._rules.length;

  for (i = 0; i < len; i++) {
    ok = rules[i](state);
    if (ok) { break; }
  }

  return ok;
};


// Generate tokens for input range
//
ParserInline.prototype.tokenize = function (state) {
  var ok, i,
      rules = this._rules,
      len = this._rules.length,
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
ParserInline.prototype.parse = function (str, options, env) {
  var state = new StateInline(str, this, options, env);

  this.tokenize(state);

  return state.tokens;
};


module.exports = ParserInline;
