// Inline parser

'use strict';


var Ruler           = require('./ruler');
var StateInline     = require('./rules_inline/state_inline');
var replaceEntities = require('./common/utils').replaceEntities;

////////////////////////////////////////////////////////////////////////////////
// Parser rules

var _rules = [
  [ 'text',       require('./rules_inline/text') ],
  [ 'newline',    require('./rules_inline/newline') ],
  [ 'escape',     require('./rules_inline/escape') ],
  [ 'backticks',  require('./rules_inline/backticks') ],
  [ 'del',        require('./rules_inline/del') ],
  [ 'ins',        require('./rules_inline/ins') ],
  [ 'mark',       require('./rules_inline/mark') ],
  [ 'emphasis',   require('./rules_inline/emphasis') ],
  [ 'sub',        require('./rules_inline/sub') ],
  [ 'sup',        require('./rules_inline/sup') ],
  [ 'links',      require('./rules_inline/links') ],
  [ 'autolink',   require('./rules_inline/autolink') ],
  [ 'htmltag',    require('./rules_inline/htmltag') ],
  [ 'entity',     require('./rules_inline/entity') ]
];


var BAD_PROTOCOLS = [ 'vbscript', 'javascript', 'file' ];

function validateLink(url) {
  var str = url.trim().toLowerCase();

  // Care about digital entities "javascript&#x3A;alert(1)"
  str = replaceEntities(str);

  if (str.indexOf(':') >= 0 && BAD_PROTOCOLS.indexOf(str.split(':')[0]) >= 0) {
    return false;
  }
  return true;
}

// Inline Parser class
//
function ParserInline() {
  // By default CommonMark allows too much in links
  // If you need to restrict it - override this with your validator.
  this.validateLink = validateLink;

  this.ruler = new Ruler();

  for (var i = 0; i < _rules.length; i++) {
    this.ruler.push(_rules[i][0], _rules[i][1]);
  }
}


// Skip single token by running all rules in validation mode;
// returns `true` if any rule reported success
//
ParserInline.prototype.skipToken = function (state) {
  var i, cached_pos, pos = state.pos,
      rules = this.ruler.getRules(''),
      len = rules.length;

  if ((cached_pos = state.cacheGet(pos)) > 0) {
    state.pos = cached_pos;
    return;
  }

  for (i = 0; i < len; i++) {
    if (rules[i](state, true)) {
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
      rules = this.ruler.getRules(''),
      len = rules.length,
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
};


// Parse input string.
//
ParserInline.prototype.parse = function (str, options, env, outTokens) {
  var state = new StateInline(str, this, options, env, outTokens);

  this.tokenize(state);
};


module.exports = ParserInline;
