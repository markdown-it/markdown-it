// Process *this* and _that_

'use strict';


function isAlphaNum(code) {
  return (code >= 0x30 /* 0 */ && code <= 0x39 /* 9 */) ||
         (code >= 0x41 /* A */ && code <= 0x5A /* Z */) ||
         (code >= 0x61 /* a */ && code <= 0x7A /* z */);
}

// returns the amount of markers (1, 2, 3, 4+), or -1 on failure;
// "start" should point at a valid marker
//
// note: in case if 4+ markers it is still not a valid emphasis,
// should be treated as a special case
function parseStart(state, start) {
  var pos = start, lastChar, nextChar, count,
      max = state.posMax,
      marker = state.src.charCodeAt(start);

  lastChar = start > 0 ? state.src.charCodeAt(start - 1) : -1;

  while (pos < max && state.src.charCodeAt(pos) === marker) { pos++; }
  if (pos >= max) { return -1; }
  count = pos - start;

  // Quoting spec:
  //
  // Character can open emphasis iff
  //  1. it is not part of a sequence of four or more unescaped markers,
  //  2. it is not followed by whitespace,
  //  3. it is "_" and it is not preceded by an ASCII alphanumeric character, and
  //  4. either it is not followed by a marker or it is followed immediately by strong emphasis.

  if (count >= 4) {
    // check condition 1
    // sequence of four or more unescaped markers can't start an emphasis
    return count;
  }

  // check condition 2, marker followed by whitespace
  nextChar = state.src.charCodeAt(pos);
  if (nextChar === 0x20 || nextChar === 0x0A) { return -1; }

  if (marker === 0x5F /* _ */) {
    // check condition 3, if it's the beginning of the word
    // we need to look back for this
    if (isAlphaNum(lastChar)) { return -1; }
  }

  return count;
}

// returns the amount of markers (1, 2, 3, 4+), or -1 on failure;
// "start" should point at a valid marker
//
// note: in case if 4+ markers it is still not a valid emphasis,
// should be treated as a special case
function parseEnd(state, start) {
  var pos = start, lastChar, count,
      max = state.posMax,
      marker = state.src.charCodeAt(start);

  lastChar = start > 0 ? state.src.charCodeAt(start - 1) : -1;

  while (pos < max && state.src.charCodeAt(pos) === marker) { pos++; }
  count = pos - start;

  // Quoting spec:
  //
  // Character can close emphasis iff
  //  1. it is not part of a sequence of four or more unescaped markers,
  //  2. it is not preceded by whitespace,
  //  3. it is not "_" or it is not followed by an ASCII alphanumeric character

  if (count >= 4) {
    // check condition 1
    // sequence of four or more unescaped markers can't start an emphasis
    return count;
  }

  // check condition 2, marker preceded by whitespace
  if (lastChar === 0x20 || lastChar === 0x0A) { return -1; }

  if (marker === 0x5F) {
    // check condition 3, if it's the end of the word
    if (pos < max && isAlphaNum(state.src.charCodeAt(pos))) { return -1; }
  }

  return count;
}

module.exports = function emphasis(state, silent) {
  var startCount,
      count,
      oldFlag,
      found,
      ok,
      oldCount,
      newCount,
      stack,
      max = state.posMax,
      start = state.pos,
      haveLiteralAsterisk,
      marker = state.src.charCodeAt(start);

  if (marker !== 0x5F/* _ */ && marker !== 0x2A /* * */) { return false; }

  // skip emphasis in links because it has lower priority, compare:
  //  [foo *bar]()*
  //  [foo `bar]()`
  if (state.validateInsideEm || state.validateInsideLink) { return false; }

  startCount = parseStart(state, start);
  if (startCount < 0) { return false; }
  if (startCount >= 4) {
    state.pos += startCount;
    state.pending += state.src.slice(start, startCount);
    return true;
  }

  if (state.level >= state.options.maxNesting) { return false; }

  oldFlag = state.validateInsideEm;

  state.pos = start + startCount;
  stack = [ startCount ];
  state.validateInsideEm = true;

  while (state.pos < max) {
    if (state.src.charCodeAt(state.pos) === marker && !haveLiteralAsterisk) {
      count = parseEnd(state, state.pos);
      if (count >= 1 && count < 4) {
        oldCount = stack.pop();
        newCount = count;

        while (oldCount !== newCount) {
          if (newCount < oldCount) {
            stack.push(oldCount - newCount);
            break;
          }

          // assert(newCount > oldCount)
          newCount -= oldCount;

          if (stack.length === 0) { break; }
          state.pos += oldCount;
          oldCount = stack.pop();
        }

        if (stack.length === 0) {
          startCount = oldCount;
          found = true;
          break;
        }
        state.pos += count;
        continue;
      }

      count = parseStart(state, state.pos);
      if (count >= 1 && count < 4) {
        stack.push(count);
        state.pos += count;
        continue;
      }
    }

    ok = state.parser.skipToken(state);

    if (ok) {
      haveLiteralAsterisk = false;
    } else {
      haveLiteralAsterisk = state.src.charCodeAt(state.pos) === marker;
      state.pos++;
    }
  }

  // restore old state
  state.validateInsideEm = oldFlag;

  if (!found) {
    // parser failed to find ending tag, so it's not valid emphasis
    state.pos = start;
    return false;
  }

  // found!
  if (!silent) {
    state.posMax = state.pos;
    state.pos = start + startCount;

    if (startCount === 2 || startCount === 3) {
      state.push({ type: 'strong_open', level: state.level++ });
    }
    if (startCount === 1 || startCount === 3) {
      state.push({ type: 'em_open', level: state.level++ });
    }

    state.parser.tokenize(state);

    if (startCount === 1 || startCount === 3) {
      state.push({ type: 'em_close', level: --state.level });
    }
    if (startCount === 2 || startCount === 3) {
      state.push({ type: 'strong_close', level: --state.level });
    }
  }

  state.pos = state.posMax + startCount;
  state.posMax = max;
  return true;
};
