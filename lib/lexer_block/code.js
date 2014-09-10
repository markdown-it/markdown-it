// Code block (4 spaces padded)

'use strict';


var isEmpty  = require('../helpers').isEmpty;
var getLines = require('../helpers').getLines;


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
    content: getLines(state, startLine, last, true).replace(/^ {1,4}/gm, '')
  });

  state.line = nextLine;
  return true;
};
