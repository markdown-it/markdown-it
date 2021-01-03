// Proceess '\n'

'use strict';

var isSpace = require('../common/utils').isSpace;


module.exports = function newline(state, silent) {
  if (state.src.charCodeAt(state.pos) !== 0x0A/* \n */) { return false; }

  var pmax, max,
      pending = state.pending,
      pos = state.pos;

  pmax = pending.length - 1;
  max = state.posMax;

  // '  \n' -> hardbreak
  // Lookup in pending chars is bad practice! Don't copy to other rules!
  // Pending string is stored in concat mode, indexed lookups will cause
  // convertion to flat mode.
  if (!silent) {
    if (pmax >= 0 && pending.charCodeAt(pmax) === 0x20) {
      if (pmax >= 1 && pending.charCodeAt(pmax - 1) === 0x20) {
        state.pending = pending.replace(/ +$/, '');
        state.push('hardbreak', 'br', 0);
      } else {
        state.pending = pending.slice(0, -1);
        state.push('softbreak', 'br', 0);
      }

    } else {
      state.push('softbreak', 'br', 0);
    }
  }

  pos++;

  // skip heading spaces for next line
  while (pos < max && isSpace(state.src.charCodeAt(pos))) { pos++; }

  state.pos = pos;
  return true;
};
