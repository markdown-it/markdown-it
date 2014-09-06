// Block quotes

'use strict';


var skipEmptyLines = require('../helpers').skipEmptyLines;
var skipSpaces = require('../helpers').skipSpaces;


module.exports = function blockquote(state, startLine, endLine, silent) {
  var marker, nextLine, oldBMarks, lastLineEmpty,
      rules_named = state.lexerBlock.rules_named,
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

  // check if we have an empty blockquote
  pos = pos < max ? skipSpaces(state, pos) : pos;
  lastLineEmpty = pos >= max;

  // Search the end of the block
  //
  // Block ends with either:
  //  1. an empty line outside:
  //     ```
  //     > test
  //
  //     ```
  //  2. an empty line inside:
  //     ```
  //     >
  //     test
  //     ```
  //  3. another tag
  //     ```
  //     > test
  //      - - -
  //     ```
  for (nextLine = startLine + 1; nextLine < endLine; nextLine++) {
    pos = state.bMarks[nextLine] + state.tShift[nextLine];
    max = state.eMarks[nextLine];

    if (pos >= max) {
      // Case 1: line is not inside the blockquote, and this line is empty.
      break;
    }

    if (state.src.charCodeAt(pos++) === 0x3E/* > */) {
      // This line is inside the blockquote.
      pos = pos < max ? skipSpaces(state, pos) : pos;
      lastLineEmpty = pos >= max;
      continue;
    }

    // Case 2: line is not inside the blockquote, and the last line was empty.
    if (lastLineEmpty) { break; }

    // Case 3: another tag found.
    if (rules_named.fences(state, nextLine, endLine, true)) { break; }
    if (rules_named.hr(state, nextLine, endLine, true)) { break; }
    if (rules_named.heading(state, nextLine, endLine, true)) { break; }
    if (rules_named.lheading(state, nextLine, endLine, true)) { break; }
  }

  state.tokens.push({ type: 'blockquote_open' });
  state.lexerInline.tokenize(
    state,
    state.bMarks[startLine],
    state.eMarks[nextLine - 1]
  );
  state.tokens.push({ type: 'blockquote_close' });

  state.line = skipEmptyLines(state, nextLine);
  return true;
};
