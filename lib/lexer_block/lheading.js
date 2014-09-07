// lheading (---, ===)

'use strict';


var skipEmptyLines  = require('../helpers').skipEmptyLines;
var skipSpaces      = require('../helpers').skipSpaces;
var skipChars       = require('../helpers').skipChars;


module.exports = function lheading(state, startLine, endLine, silent) {
  var marker, pos, mem, max,
      next = startLine + 1;

  if (next >= state.lineMax) { return false; }

  // Scan next line
  pos = state.bMarks[next] + state.tShift[next];
  max = state.eMarks[next];

  if (pos + 3 > max) { return false; }

  marker = state.src.charCodeAt(pos);

  if (marker !== 0x2D/* - */ && marker !== 0x3D/* = */) { return false; }

  mem = pos;
  pos = skipChars(state, pos, marker);

  if (pos - mem < 3) { return false; }

  pos = skipSpaces(state, pos);

  if (pos < max) { return false; }

  if (silent) { return true; }

  state.tokens.push({ type: 'heading_open', level: marker === 0x3D/* = */ ? 1 : 2 });
  state.lexerInline.tokenize(state, state.bMarks[startLine], state.eMarks[startLine]);
  state.tokens.push({ type: 'heading_close', level: marker === 0x3D/* = */ ? 1 : 2 });

  state.line = skipEmptyLines(state, ++next);
  return true;
};
