// Block quotes

'use strict';


var getLines = require('../helpers').getLines;
var isEmpty  = require('../helpers').isEmpty;


module.exports = function blockquote(state, startLine, endLine, silent) {
  var nextLine, subState, insideLines, lineMax,
      pos = state.bMarks[startLine] + state.tShift[startLine],
      max = state.eMarks[startLine];

  // should not have > 3 leading spaces
  if (state.tShift[startLine] > 3) { return false; }

  if (pos > max) { return false; }

  // check the block quote marker
  if (state.src.charCodeAt(pos++) !== 0x3E/* > */) { return false; }

  // we know that it's going to be a valid blockquote,
  // so no point trying to find the end of it in silent mode
  if (silent) { return true; }

  lineMax = state.lineMax;
  insideLines = 1;
  state.tokens.push({ type: 'blockquote_open' });
  for (nextLine = startLine + 1; nextLine < lineMax; ) {
    pos = state.bMarks[nextLine] + state.tShift[nextLine];
    max = state.eMarks[nextLine];

    if (pos < max && state.src.charCodeAt(pos++) === 0x3E/* > */) {
      if (nextLine < endLine) {
        nextLine++;
        insideLines++;
        continue;
      } else {
        break;
      }
    }

    if (insideLines === 0) {
      break;
    }

    while (nextLine < lineMax) {
      if (isEmpty(state, nextLine)) { break; }
      nextLine++;
    }
    subState = state.clone(getLines(state, startLine, nextLine, true)
                                  .replace(/^ {0,3}> ?/mg, ''));
    state.lexerBlock.tokenize(subState, 0, insideLines);
    nextLine = startLine = subState.line + startLine;
    insideLines = 0;
  }
  state.tokens.push({ type: 'blockquote_close' });

  state.line = nextLine;
  return true;
};
