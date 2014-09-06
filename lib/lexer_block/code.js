// Code block (4 spaces padded)

'use strict';


var isEmpty = require('../helpers').isEmpty;


module.exports = function code(state, startLine, endLine, silent) {
  var nextLine, last;

  if (state.tShift[startLine] < 4) { return false; }

  last = nextLine = startLine + 1;

  while (nextLine < endLine) {
    if (isEmpty(state, nextLine)) {
      nextLine++;
      if (state.options.pedantic) {
        last = nextLine;
      }
      continue;
    }
    if (state.tShift[nextLine] >= 4) {
      nextLine++;
      last = nextLine;
      continue;
    }
    break;
  }

  if (silent) { return true; }

  state.tokens.push({
    type: 'code',
    startLine: startLine,
    endLine: last
  });

  state.line = nextLine;
  return true;
};