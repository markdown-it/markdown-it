// lheading (---, ===)

'use strict';


var skipSpaces      = require('../helpers').skipSpaces;
var skipChars       = require('../helpers').skipChars;
var skipCharsBack   = require('../helpers').skipCharsBack;


module.exports = function lheading(state, startLine, endLine, silent) {
  var marker, pos, max,
      next = startLine + 1;

  if (next >= endLine) { return false; }
  if (state.tShift[next] < state.blkIndent) { return false; }

  // Scan next line
  if (state.tShift[next] - state.blkIndent > 3) { return false; }

  pos = state.bMarks[next] + state.tShift[next];
  max = state.eMarks[next];

  marker = state.src.charCodeAt(pos);

  if (marker !== 0x2D/* - */ && marker !== 0x3D/* = */) { return false; }

  pos = skipChars(state, pos, marker);

  pos = skipSpaces(state, pos);

  if (pos < max) { return false; }

  if (silent) { return true; }

  pos = state.bMarks[startLine] + state.tShift[startLine];
  max = skipCharsBack(state, state.eMarks[startLine], 0x20/* space */, pos);

  state.tokens.push({ type: 'heading_open', level: marker === 0x3D/* = */ ? 1 : 2 });
  state.lexerInline.tokenize(state, pos, max);
  state.tokens.push({ type: 'heading_close', level: marker === 0x3D/* = */ ? 1 : 2 });

  state.line = next + 1;
  return true;
};
