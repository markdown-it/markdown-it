// Skip text characters for text token, place those to pendibg buffer
// and increment current pos

'use strict';

module.exports = function text(state, silent) {
  var str = state.src.slice(state.pos),
      next = str.search(state.parser.textMatch);

  if (next === 0) { return false; }

  if (next < 0) { next = str.length; }

  if (!silent) { state.pending += str.slice(0, next); }
  state.pos += next;

  return true;
};
