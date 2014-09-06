// heading (#, ##, ...)

'use strict';


var isWhiteSpace    = require('../helpers').isWhiteSpace;
var skipEmptyLines  = require('../helpers').skipEmptyLines;
var skipSpaces      = require('../helpers').skipSpaces;


module.exports = function heading(state, startLine, endLine, silent) {
  var ch, level,
      pos = state.bMarks[startLine],
      max = state.eMarks[startLine],
      start = pos;

  pos += state.tShift[startLine];

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
  pos = pos < max ? skipSpaces(state, pos) : pos;

  // Now pos contains offset of first heared char
  // Let's cut tails like '    ###  ' from the end of string

  max--;
  ch = state.src.charCodeAt(max);

  while (max > start && isWhiteSpace(ch)) {
    ch = state.src.charCodeAt(--max);
  }
  if (ch === 0x23/* # */) {
    while (max > start && ch === 0x23/* # */) {
      ch = state.src.charCodeAt(--max);
    }
    if (isWhiteSpace(ch)) {
      while (max > start && isWhiteSpace(ch)) {
        ch = state.src.charCodeAt(--max);
      }
    } else if (ch === 0x5C/* \ */) {
      max++;
    }
  }
  max++;

  if (silent) { return true; }

  state.tokens.push({ type: 'heading_open', level: level });
  // only if header is not empty
  if (pos < max) {
    state.lexerInline.tokenize(state, pos, max);
  }
  state.tokens.push({ type: 'heading_close', level: level });

  state.line = skipEmptyLines(state, ++startLine);
  return true;
};