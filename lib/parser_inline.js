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
rules.push(require('./rules_inline/strikethrough'));
rules.push(require('./rules_inline/emphasis'));
rules.push(require('./rules_inline/links'));
rules.push(require('./rules_inline/autolink'));
rules.push(require('./rules_inline/htmltag'));
rules.push(require('./rules_inline/entity'));
rules.push(require('./rules_inline/escape_html_char'));

var BAD_PROTOCOLS = [ 'vbscript', 'javascript', 'file' ];

function validateLink(url) {
  var str = '';

  try {
    str = decodeURI(url).trim().toLowerCase();
  } catch (_) {}

  if (!str) { return false; }

  if (str.indexOf(':') >= 0 && BAD_PROTOCOLS.indexOf(str.split(':')[0]) >= 0) {
    return false;
  }
  return true;
}

// Inline Parser class
//
function ParserInline() {
  this._rules = [];

  // Rule to skip pure text
  // - '{$%@}' reserved for extentions
  // - '<>"' added for internal html escaping
  this.textMatch = /^[^\n\\`*_\[\]!&{}$%@<>"~]+/;

  // By default CommonMark allows too much in links
  // If you need to restrict it - override this with your validator.
  this.validateLink = validateLink;

  this.ruler = new Ruler(this.rulesUpdate.bind(this));

  for (var i = 0; i < rules.length; i++) {
    this.ruler.after(rules[i]);
  }
}


ParserInline.prototype.rulesUpdate = function () {
  this._rules = this.ruler.getRules();
};


// Skip single token by running all rules in validation mode;
// returns `true` if any rule reported success
//
ParserInline.prototype.skipToken = function (state) {
  var i, cached_pos, pos = state.pos,
      rules = this._rules,
      len = this._rules.length;

  if ((cached_pos = state.cacheGet(pos)) > 0) {
    state.pos = cached_pos;
    return true;
  }

  for (i = 0; i < len; i++) {
    if (rules[i](state, true)) {
      state.cacheSet(pos, state.pos);
      return true;
    }
  }

  return false;
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
      ok = rules[i](state, false);
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

  if (options.linkify) {
    this.linkifier.process(state);
  }
  if (options.typographer) {
    this.typographer.process(state);
  }

  return state.tokens;
};


module.exports = ParserInline;
