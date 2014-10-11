// Block parser


'use strict';


var Ruler           = require('./ruler');
var State           = require('./rules_block/state_block');

var skipEmptyLines  = require('./helpers').skipEmptyLines;
var isEmpty         = require('./helpers').isEmpty;


var rules = [];

// `list` should be after `hr`, but before `heading`
rules.push([ require('./rules_block/code') ]);
rules.push([ require('./rules_block/fences'),     'paragraph', 'blockquote', 'list' ]);
rules.push([ require('./rules_block/blockquote'), 'paragraph', 'blockquote', 'list' ]);
rules.push([ require('./rules_block/hr'),         'paragraph', 'blockquote', 'list' ]);
rules.push([ require('./rules_block/list'),       'paragraph', 'blockquote' ]);
rules.push([ require('./rules_block/heading'),    'paragraph', 'blockquote' ]);
rules.push([ require('./rules_block/lheading') ]);
rules.push([ require('./rules_block/htmlblock'),  'paragraph', 'blockquote' ]);
rules.push([ require('./rules_block/table'),      'paragraph' ]);
rules.push([ require('./rules_block/paragraph') ]);


// Block Parser class
//
function ParserBlock() {
  this._rules = [];
  this._rulesParagraphTerm  = [];
  this._rulesBlockquoteTerm = [];
  this._rulesListTerm       = [];

  this.ruler = new Ruler(this.rulesUpdate.bind(this));

  for (var i = 0; i < rules.length; i++) {
    this.ruler.after(rules[i][0], rules[i].slice(1));
  }
}


ParserBlock.prototype.rulesUpdate = function () {
  this._rules = this.ruler.getRules();
  this._rulesParagraphTerm  = this.ruler.getRules('paragraph');
  this._rulesBlockquoteTerm = this.ruler.getRules('blockquote');
  this._rulesListTerm       = this.ruler.getRules('list');
};


// Generate tokens for input range
//
ParserBlock.prototype.tokenize = function (state, startLine, endLine) {
  var ok, i,
      rules = this._rules,
      len = this._rules.length,
      line = startLine,
      hasEmptyLines = false;

  while (line < endLine) {
    state.line = line = skipEmptyLines(state, line, endLine);
    if (line >= endLine) { break; }

    if (state.tShift[line] < state.blkIndent) { break; }
    if (state.bqMarks[line] < state.bqLevel) { break; }

    // Try all possible rules.
    // On success, rule should:
    //
    // - update `state.line`
    // - update `state.tokens`
    // - return true

    for (i = 0; i < len; i++) {
      ok = rules[i](state, line, endLine, false);
      if (ok) { break; }
    }

    if (!ok) { throw new Error('No matching rules found'); }

    if (line === state.line) {
      throw new Error('None of rules updated state.line');
    }

    // set state.tight iff we had an empty line before current tag
    // i.e. latest empty line should not count
    state.tight = !hasEmptyLines;

    // paragraph might "eat" one newline after it in nested lists
    if (isEmpty(state, state.line - 1)) {
      hasEmptyLines = true;
    }

    line = state.line;

    if (line < endLine && isEmpty(state, line)) {
      hasEmptyLines = true;
      line++;

      // two empty lines should stop the parser in list mode
      if (line < endLine && state.listMode && isEmpty(state, line)) { break; }
      state.line = line;
    }
  }
};


ParserBlock.prototype.parse = function (src, options, env) {
  var state, lineStart = 0, lastTabPos = 0;

  if (!src) { return ''; }

  if (src.indexOf('\r') >= 0) {
    src = src.replace(/\r/, '');
  }

  if (src.indexOf('\u00a0') >= 0) {
    src = src.replace(/\u00a0/g, ' ');
  }

  if (src.indexOf('\u2424') >= 0) {
    src = src.replace(/\u2424/g, '\n');
  }

  // Replace tabs with proper number of spaces (1..4)
  if (src.indexOf('\t') >= 0) {
    src = src.replace(/[\n\t]/g, function (match, offset) {
      var result;
      if (src.charCodeAt(offset) === 0x0A) {
        lineStart = offset + 1;
        lastTabPos = 0;
        return match;
      }
      result = '    '.slice((offset - lineStart - lastTabPos) % 4);
      lastTabPos = offset - lineStart + 1;
      return result;
    });
  }

  state = new State(
    src,
    this,
    [],
    options,
    env
  );

  this.tokenize(state, state.line, state.lineMax);

  return state.tokens;
};


module.exports = ParserBlock;
