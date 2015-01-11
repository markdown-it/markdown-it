// ~~strike through~~
//
'use strict';


var isWhiteSpace   = require('../common/utils').isWhiteSpace;
var isPunctChar    = require('../common/utils').isPunctChar;
var isMdAsciiPunct = require('../common/utils').isMdAsciiPunct;


// parse sequence of markers,
// "start" should point at a valid marker
function scanDelims(state, start) {
  var pos = start, lastChar, nextChar, count,
      isLastWhiteSpace, isLastPunctChar,
      isNextWhiteSpace, isNextPunctChar,
      can_open = true,
      can_close = true,
      max = state.posMax,
      marker = state.src.charCodeAt(start);

  lastChar = start > 0 ? state.src.charCodeAt(start - 1) : -1;

  while (pos < max && state.src.charCodeAt(pos) === marker) { pos++; }
  if (pos >= max) { can_open = false; }
  count = pos - start;

  nextChar = pos < max ? state.src.charCodeAt(pos) : -1;

  isLastPunctChar = lastChar >= 0 &&
    (isMdAsciiPunct(lastChar) || isPunctChar(String.fromCharCode(lastChar)));
  isNextPunctChar = nextChar >= 0 &&
    (isMdAsciiPunct(nextChar) || isPunctChar(String.fromCharCode(nextChar)));
  isLastWhiteSpace = lastChar >= 0 && isWhiteSpace(lastChar);
  isNextWhiteSpace = nextChar >= 0 && isWhiteSpace(nextChar);

  if (isNextWhiteSpace) {
    can_open = false;
  } else if (isNextPunctChar) {
    if (!(isLastWhiteSpace || isLastPunctChar || lastChar === -1)) {
      can_open = false;
    }
  }

  if (isLastWhiteSpace) {
    can_close = false;
  } else if (isLastPunctChar) {
    if (!(isNextWhiteSpace || isNextPunctChar || nextChar === -1)) {
      can_close = false;
    }
  }

  return {
    can_open: can_open,
    can_close: can_close,
    delims: count
  };
}


module.exports = function strikethrough(state, silent) {
  var startCount,
      count,
      tagCount,
      found,
      stack,
      res,
      max = state.posMax,
      start = state.pos,
      marker = state.src.charCodeAt(start);

  if (marker !== 0x7E/* ~ */) { return false; }
  if (silent) { return false; } // don't run any pairs in validation mode

  res = scanDelims(state, start);
  startCount = res.delims;
  if (!res.can_open) {
    state.pos += startCount;
    // Earlier we checked !silent, but this implementation does not need it
    state.pending += state.src.slice(start, state.pos);
    return true;
  }

  stack = Math.floor(startCount / 2);
  if (stack <= 0) { return false; }
  state.pos = start + startCount;

  while (state.pos < max) {
    if (state.src.charCodeAt(state.pos) === marker) {
      res = scanDelims(state, state.pos);
      count = res.delims;
      tagCount = Math.floor(count / 2);
      if (res.can_close) {
        if (tagCount >= stack) {
          state.pos += count - 2;
          found = true;
          break;
        }
        stack -= tagCount;
        state.pos += count;
        continue;
      }

      if (res.can_open) { stack += tagCount; }
      state.pos += count;
      continue;
    }

    state.md.inline.skipToken(state);
  }

  if (!found) {
    // parser failed to find ending tag, so it's not valid emphasis
    state.pos = start;
    return false;
  }

  // found!
  state.posMax = state.pos;
  state.pos = start + 2;

  // Earlier we checked !silent, but this implementation does not need it
  state.push({ type: 's_open', level: state.level++ });
  state.md.inline.tokenize(state);
  state.push({ type: 's_close', level: --state.level });

  state.pos = state.posMax + 2;
  state.posMax = max;
  return true;
};
