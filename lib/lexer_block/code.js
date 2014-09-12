// Code block (4 spaces padded)

'use strict';


var isEmpty  = require('../helpers').isEmpty;
var getLines = require('../helpers').getLines;


module.exports = function code(state, startLine, endLine, silent) {
  var nextLine, last;

  if (state.tShift[startLine] - state.blkIndent < 4) { return false; }

  last = nextLine = startLine + 1;

  while (nextLine < endLine) {
    if (isEmpty(state, nextLine)) {
      nextLine++;
      if (state.options.pedantic) {
        last = nextLine;
      }
      continue;
    }
    if (state.tShift[nextLine] - state.blkIndent >= 4) {
      nextLine++;
      last = nextLine;
      continue;
    }
    break;
  }

  if (silent) { return true; }

  state.tokens.push({
    type: 'code',
    content: getLines(state, startLine, last, 4 + state.blkIndent, true)
  });

  state.line = nextLine;
  return true;
};
