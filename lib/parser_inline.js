// Inline parser

'use strict';


var Ruler       = require('./ruler');
var StateInline = require('./rules_inline/state_inline');

////////////////////////////////////////////////////////////////////////////////
// Parser rules

var _rules = [];

_rules.push(require('./rules_inline/text'));
_rules.push(require('./rules_inline/newline'));
_rules.push(require('./rules_inline/escape'));
_rules.push(require('./rules_inline/backticks'));
_rules.push(require('./rules_inline/del'));
_rules.push(require('./rules_inline/ins'));
_rules.push(require('./rules_inline/mark'));
_rules.push(require('./rules_inline/emphasis'));
_rules.push(require('./rules_inline/links'));
_rules.push(require('./rules_inline/autolink'));
_rules.push(require('./rules_inline/htmltag'));
_rules.push(require('./rules_inline/entity'));


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
  // - '{}$%@+=:' reserved for extentions
  this.textMatch = /[\n\\`*_\[\]!&<{}$%@~+=:]/;

  // By default CommonMark allows too much in links
  // If you need to restrict it - override this with your validator.
  this.validateLink = validateLink;

  this.ruler = new Ruler(this.rulesUpdate.bind(this));

  for (var i = 0; i < _rules.length; i++) {
    this.ruler.after(_rules[i]);
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
      len = this._rules.length;

  if ((cached_pos = state.cacheGet(pos)) > 0) {
    state.pos = cached_pos;
    return;
  }

  for (i = 0; i < len; i++) {
    if (this._rules[i](state, true)) {
      state.cacheSet(pos, state.pos);
      return;
    }
  }

  state.pos++;
  state.cacheSet(pos, state.pos);
};


// Generate tokens for input range
//
ParserInline.prototype.tokenize = function (state) {
  var ok, i,
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
      ok = this._rules[i](state, false);
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
