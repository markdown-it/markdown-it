// heading (#, ##, ...)

'use strict';


var isWhiteSpace    = require('../helpers').isWhiteSpace;
var skipSpaces      = require('../helpers').skipSpaces;
var skipCharsBack   = require('../helpers').skipCharsBack;


module.exports = function heading(state, startLine, endLine, silent) {
  var ch, level,
      pos = state.bMarks[startLine] + state.tShift[startLine],
      max = state.eMarks[startLine];

  if (pos >= max) { return false; }

  ch  = state.src.charCodeAt(pos);

  if (ch !== 0x23/* # */ || pos >= max) { return false; }

  // count heading level
  level = 1;
  ch = state.src.charCodeAt(++pos);
  while (ch === 0x23/* # */ && pos < max && level <= 6) {
    level++;
    ch = state.src.charCodeAt(++pos);
  }

  if (level > 6 || (pos < max && !isWhiteSpace(ch))) { return false; }

  // skip spaces before heading text
  pos = skipSpaces(state, pos);

  // Now pos contains offset of first heared char
  // Let's cut tails like '    ###  ' from the end of string

  max = skipCharsBack(state, max, 0x20/* space */, pos);
  max = skipCharsBack(state, max, 0x23/* # */, pos);

  if (max < state.eMarks[startLine] &&
      state.src.charCodeAt(max) === 0x23/* # */ &&
      state.src.charCodeAt(max - 1) === 0x5C/* \ */) {
    max++;
  }

  // ## Foo   ####
  //       ^^^
  max = skipCharsBack(state, max, 0x20/* space */, pos);

  if (silent) { return true; }

  state.tokens.push({ type: 'heading_open', level: level });
  // only if header is not empty
  if (pos < max) {
    state.tokens.push({
      type: 'inline',
      content: state.src.slice(pos, max)
    });
  }
  state.tokens.push({ type: 'heading_close', level: level });

  state.line = startLine + 1;
  return true;
};
