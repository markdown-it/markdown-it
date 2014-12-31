/** internal
 * class ParserBlock
 *
 * Block-level tokenizer.
 **/
'use strict';


var Ruler           = require('./ruler');
var StateBlock      = require('./rules_block/state_block');


var _rules = [
  [ 'code',       require('./rules_block/code') ],
  [ 'fences',     require('./rules_block/fences'),     [ 'paragraph', 'blockquote', 'list' ] ],
  [ 'blockquote', require('./rules_block/blockquote'), [ 'paragraph', 'blockquote', 'list' ] ],
  [ 'hr',         require('./rules_block/hr'),         [ 'paragraph', 'blockquote', 'list' ] ],
  [ 'list',       require('./rules_block/list'),       [ 'paragraph', 'blockquote' ] ],
  [ 'footnote',   require('./rules_block/footnote'),   [ 'paragraph' ] ],
  [ 'heading',    require('./rules_block/heading'),    [ 'paragraph', 'blockquote' ] ],
  [ 'lheading',   require('./rules_block/lheading') ],
  [ 'htmlblock',  require('./rules_block/htmlblock'),  [ 'paragraph', 'blockquote' ] ],
  [ 'table',      require('./rules_block/table'),      [ 'paragraph' ] ],
  [ 'deflist',    require('./rules_block/deflist'),    [ 'paragraph' ] ],
  [ 'paragraph',  require('./rules_block/paragraph') ]
];


/**
 * new ParserBlock()
 **/
function ParserBlock() {
  /**
   * ParserBlock#ruler -> Ruler
   *
   * [[Ruler]] instance. Keep configuration of block rules.
   **/
  this.ruler = new Ruler();

  for (var i = 0; i < _rules.length; i++) {
    this.ruler.push(_rules[i][0], _rules[i][1], { alt: (_rules[i][2] || []).slice() });
  }
}


// Generate tokens for input range
//
ParserBlock.prototype.tokenize = function (state, startLine, endLine) {
  var ok, i,
      rules = this.ruler.getRules(''),
      len = rules.length,
      line = startLine,
      hasEmptyLines = false;

  while (line < endLine) {
    state.line = line = state.skipEmptyLines(line);
    if (line >= endLine) { break; }

    // Termination condition for nested calls.
    // Nested calls currently used for blockquotes & lists
    if (state.tShift[line] < state.blkIndent) { break; }

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

    // set state.tight iff we had an empty line before current tag
    // i.e. latest empty line should not count
    state.tight = !hasEmptyLines;

    // paragraph might "eat" one newline after it in nested lists
    if (state.isEmpty(state.line - 1)) {
      hasEmptyLines = true;
    }

    line = state.line;

    if (line < endLine && state.isEmpty(line)) {
      hasEmptyLines = true;
      line++;

      // two empty lines should stop the parser in list mode
      if (line < endLine && state.parentType === 'list' && state.isEmpty(line)) { break; }
      state.line = line;
    }
  }
};

var TABS_SCAN_RE = /[\n\t]/g;
var NEWLINES_RE  = /\r[\n\u0085]|[\u2424\u2028\u0085]/g;
var SPACES_RE    = /\u00a0/g;
var NULL_RE      = /\u0000/g;

/**
 * ParserBlock.parse(str, options, env, outTokens)
 *
 * Process input string and push block tokens into `outTokens`
 **/
ParserBlock.prototype.parse = function (src, options, env, outTokens) {
  var state, lineStart = 0, lastTabPos = 0;

  if (!src) { return []; }

  // Normalize spaces
  src = src.replace(SPACES_RE, ' ');

  // Normalize newlines
  src = src.replace(NEWLINES_RE, '\n');

  // Strin NULL characters
  src = src.replace(NULL_RE, '');

  // Replace tabs with proper number of spaces (1..4)
  if (src.indexOf('\t') >= 0) {
    src = src.replace(TABS_SCAN_RE, function (match, offset) {
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

  state = new StateBlock(
    src,
    this,
    options,
    env,
    outTokens
  );

  this.tokenize(state, state.line, state.lineMax);
};


module.exports = ParserBlock;
