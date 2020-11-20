// Parse backticks

'use strict';


function addCodeToken(state, marker, pos, matchStart) {
  var token     = state.push('code_inline', 'code', 0);
  token.markup  = marker;
  token.content = state.src.slice(pos, matchStart)
    .replace(/\n/g, ' ')
    .replace(/^ (.+) $/, '$1');
}


module.exports = function backtick(state, silent) {
  var start, max, marker, matchStart, matchEnd, startLength, endLength,
      pos = state.pos,
      ch = state.src.charCodeAt(pos);

  if (ch !== 0x60/* ` */) { return false; }

  start = pos;
  pos++;
  max = state.posMax;

  // scan marker length
  while (pos < max && state.src.charCodeAt(pos) === 0x60/* ` */) { pos++; }

  marker = state.src.slice(start, pos);
  startLength = marker.length;

  // Look for required marker length in the cache first
  if (state.backticks[startLength] && state.backticks[startLength] > start) {
    if (state.backticks[startLength] === Infinity) {
      if (!silent) state.pending += marker;
      state.pos += startLength;
    } else {
      if (!silent) addCodeToken(state, marker, pos, state.backticks[startLength]);
      state.pos = matchEnd;
    }
    return true;
  }

  matchStart = matchEnd = pos;

  // Nothing found in the cache, scan until the end of the line (or until marker is found)
  while ((matchStart = state.src.indexOf('`', matchEnd)) !== -1) {
    matchEnd = matchStart + 1;

    // scan marker length
    while (matchEnd < max && state.src.charCodeAt(matchEnd) === 0x60/* ` */) { matchEnd++; }

    endLength = matchEnd - matchStart;

    if (endLength === marker.length) {
      // Found matching closer length.
      if (!silent) addCodeToken(state, marker, pos, matchStart);
      state.pos = matchEnd;
      return true;
    }

    // Some different length found, put it in cache just in case
    if (!state.backticks[endLength] || state.backticks[endLength] <= start) {
      state.backticks[endLength] = matchStart;
    }

    // Scanned through the end, didn't find anything. Mark "no matches" for this length;
    if (matchEnd >= max) {
      state.backticks[startLength] = Infinity;
    }
  }

  if (!silent) state.pending += marker;
  state.pos += startLength;
  return true;
};
