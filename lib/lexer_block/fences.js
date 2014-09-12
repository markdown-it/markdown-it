// fences (``` lang, ~~~ lang)

'use strict';


var skipSpaces      = require('../helpers').skipSpaces;
var skipChars       = require('../helpers').skipChars;
var getLines        = require('../helpers').getLines;


module.exports = function fences(state, startLine, endLine, silent) {
  var marker, len, params, nextLine, mem,
      haveEndMarker = false,
      pos = state.bMarks[startLine] + state.tShift[startLine],
      max = state.eMarks[startLine];

  if (pos + 3 > max) { return false; }

  marker = state.src.charCodeAt(pos);

  if (marker !== 0x7E/* ~ */ && marker !== 0x60 /* ` */) {
    return false;
  }

  // scan marker length
  mem = pos;
  pos = skipChars(state, pos, marker);

  len = pos - mem;

  if (len < 3) { return false; }

  params = state.src.slice(pos, max).trim();

  if (params.indexOf('`') >= 0) { return false; }

  // Since start is found, we can report success here in validation mode
  if (silent) { return true; }

  // search end of block
  nextLine = startLine;

  for (;;) {
    nextLine++;
    if (nextLine >= endLine) {
      // unclosed block should be autoclosed by end of document.
      // also block seems to be autoclosed by end of parent
      /*if (state.blkLevel === 0) {
        break;
      }
      return false;*/
      break;
    }

    pos = mem = state.bMarks[nextLine] + state.tShift[nextLine];
    max = state.eMarks[nextLine];

    if (pos < max && state.tShift[nextLine] < state.blkIndent) {
      // non-empty line with negative indent should stop the list:
      // - ```
      //  test
      break;
    }
    if (pos < max && state.bqMarks[nextLine] < state.bqLevel) { break; }

    if (state.src.charCodeAt(pos) !== marker) { continue; }

    pos = skipChars(state, pos, marker);

    // closing code fence must be at least as long as the opening one
    if (pos - mem < len) { continue; }

    // make sure tail has spaces only
    pos = skipSpaces(state, pos);

    if (pos < max) { continue; }

    haveEndMarker = true;
    // found!
    break;
  }

  // If a fence has heading spaces, they should be removed from its inner block
  len = state.tShift[startLine];

  state.tokens.push({
    type: 'fence',
    params: params ? params.split(/\s+/g) : [],
    content: getLines(state, startLine + 1, nextLine, len, true)
  });

  state.line = nextLine + (haveEndMarker ? 1 : 0);
  return true;
};
