// fences (``` lang, ~~~ lang)

'use strict';


var skipEmptyLines  = require('../helpers').skipEmptyLines;
var skipSpaces      = require('../helpers').skipSpaces;
var skipChars       = require('../helpers').skipChars;


module.exports =function fences(state, startLine, endLine, silent) {
  var marker, len, params, nextLine, mem,
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

  // search end of block
  nextLine = startLine;

  do {
    nextLine++;

    if (nextLine >= endLine) {
      // unclosed block should be autoclosed by end of document.
      if (state.blkLevel === 0) {
        break;
      }
      return false;
    }

    pos = mem = state.bMarks[nextLine] + state.tShift[nextLine];
    max = state.eMarks[nextLine];

    if (state.src.charCodeAt(pos) !== marker) { continue; }

    pos = skipChars(state, pos, marker);

    // closing code fence must be at least as long as the opening one
    if (pos - mem < len) { continue; }

    // make sure tail has spaces only
    pos = skipSpaces(state, pos);

    if (pos < max) { continue; }

    // found!
    break;

  } while (true);

  if (silent) { return true; }

  state.tokens.push({
    type: 'fence',
    params: params ? params.split(/\s+/g) : [],
    startLine: startLine + 1,
    endLine: nextLine
  });

  state.line = skipEmptyLines(state, nextLine + 1);
  return true;
};