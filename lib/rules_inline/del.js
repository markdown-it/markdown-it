// Process ~~strikeout~~

'use strict';

module.exports = function del(state) {
  var oldLength,
      oldPending,
      oldFlag,
      found,
      ok,
      pos,
      stack,
      max = state.posMax,
      start = state.pos,
      lastChar,
      nextChar;

  if (state.src.charCodeAt(start) !== 0x7E/* ~ */) { return false; }
  if (start + 4 >= max) { return false; }
  if (state.src.charCodeAt(start + 1) !== 0x7E/* ~ */) { return false; }

  // make del lower a priority tag with respect to links, same as <em>;
  // this code also prevents recursion
  if (state.validateInsideEm || state.validateInsideLink) { return false; }

  if (state.level >= state.options.level) { return false; }

  lastChar = state.pending.length !== 0 ? state.pending.charCodeAt(state.pending.length - 1) : -1;
  nextChar = state.src.charCodeAt(start + 2);

  if (lastChar === 0x7E/* ~ */) { return false; }
  if (nextChar === 0x7E/*   */) { return false; }
  if (nextChar === 0x20/*   */) { return false; }

  pos = start + 2;
  while (pos < max && state.src.charCodeAt(pos) === 0x7E/* ~ */) { pos++; }
  if (pos !== start + 2) {
    // sequence of 3+ markers taking as literal, same as in a emphasis
    state.pos += pos - start;
    state.pending += state.src.slice(start, pos);
    return true;
  }

  oldLength = state.tokens.length;
  oldPending = state.pending;
  oldFlag = state.validateInsideEm;

  state.pos = start + 2;
  state.validateInsideEm = true;
  stack = 1;

  while (state.pos + 1 < max) {
    if (state.src.charCodeAt(state.pos) === 0x7E/* ~ */) {
      if (state.src.charCodeAt(state.pos + 1) === 0x7E/* ~ */) {
        lastChar = state.pending.length !== 0 ? state.pending.charCodeAt(state.pending.length - 1) : -1;
        nextChar = state.pos + 2 < max ? state.src.charCodeAt(state.pos + 2) : -1;
        if (nextChar !== 0x7E/* ~ */ && lastChar !== 0x7E/* ~ */) {
          if (lastChar !== 0x20) {
            // closing '~~'
            stack--;
          } else if (nextChar !== 0x20) {
            // opening '~~'
            stack++;
          } // else {
            //  // standalone ' ~~ ' indented with spaces
            //}
          if (stack <= 0) {
            found = true;
            break;
          }
        }
      }
    }

    ok = state.parser.tokenizeSingle(state);

    if (!ok) {
      state.pending += state.src[state.pos];
      state.pos++;
    }
  }

  // restore old state
  state.tokens.length = oldLength;
  state.pending = oldPending;
  state.validateInsideEm = oldFlag;

  if (!found) {
    // parser failed to find ending tag, so it's not valid emphasis
    state.pos = start;
    return false;
  }

  // found!
  state.posMax = state.pos;
  state.pos = start + 2;

  state.push({ type: 'del_open', level: state.level++ });
  state.parser.tokenize(state);
  state.push({ type: 'del_close', level: --state.level });

  state.pos = state.posMax + 2;
  state.posMax = max;
  return true;
};
