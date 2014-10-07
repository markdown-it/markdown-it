// Code block (4 spaces padded)

'use strict';


var isEmpty  = require('../helpers').isEmpty;
var getLines = require('../helpers').getLines;


module.exports = function code(state, startLine, endLine, silent) {
  var nextLine, last;

  if (state.tShift[startLine] - state.blkIndent < 4) { return false; }

  last = nextLine = startLine + 1;

  while (nextLine < endLine) {
    if (state.bqMarks[nextLine] < state.bqLevel) { break; }
    if (isEmpty(state, nextLine)) {
      nextLine++;
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
    content: getLines(state, startLine, last, 4 + state.blkIndent, true),
    block: true,
    level: state.level
  });

  state.line = nextLine;
  return true;
};
