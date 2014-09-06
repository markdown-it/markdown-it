// fences (``` lang, ~~~ lang)

'use strict';


var skipEmptyLines = require('../helpers').skipEmptyLines;


module.exports =function fences(state, startLine, endLine, silent) {
  var marker, len, params, nextLine,
      pos = state.bMarks[startLine] + state.tShift[startLine],
      max = state.eMarks[startLine];

  if (pos + 3 > max) { return false; }

  marker = state.src.charCodeAt(pos);

  if (marker !== 0x7E/* ~ */ && marker !== 0x60 /* ` */) {
    return false;
  }

  // scan marker length
  len = 1;
  while (state.src.charCodeAt(++pos) === marker) {
    len++;
  }

  if (len < 3) { return false; }

  params = state.src.slice(pos, max).trim();

  if (!/\S/.test(params)) { return false; }

  // search end of block
  nextLine = startLine;

  do {
    nextLine++;

    if (nextLine > endLine) { return false; }

    pos = state.bMarks[nextLine] + state.tShift[nextLine];
    max = state.eMarks[nextLine];

    if (pos + 3 > max) { continue; }

    // check markers
    if (state.src.charCodeAt(pos) !== marker &&
        state.src.charCodeAt(pos + 1) !== marker &&
        state.src.charCodeAt(pos + 2) !== marker) {
      continue;
    }

    pos += 3;

    // make sure tail has spaces only
    //pos = pos < max ? skipSpaces(state, pos) : pos;

    // stmd allow any combonation of markers and spaces in tail

    if (pos < max) { continue; }

    // found!
    break;

  } while (true);

  if (silent) { return true; }

  state.tokens.push({
    type: 'fence',
    params: params.split(/\s+/g),
    startLine: startLine + 1,
    endLine: nextLine
  });

  state.line = skipEmptyLines(state, nextLine + 1);
  return true;
};