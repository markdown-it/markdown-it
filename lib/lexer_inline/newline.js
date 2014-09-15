// Proceess '\n'

module.exports = function escape(state) {
  var pmax, pos = state.pos;

  if (state.src.charCodeAt(pos) !== 0x0A/* \n */) { return false; }

  pmax = state.pending.length - 1;

  // '  \n' -> hardbreak
  if (pmax >= 1 &&
      state.pending.charCodeAt(pmax) === 0x20 &&
      state.pending.charCodeAt(pmax - 1) === 0x20) {
    state.pending = state.pending.slice(0, -2);
    state.push({
      type: 'hardbreak'
    });
    state.pos++;
    return true;
  }

  state.pending = state.pending.trim() + '\n';

  pos++;

  // skip spaces to simplify trim
  while (state.src.charCodeAt(pos) === 0x20) { pos++; }

  state.pos = pos;

  return true;
};
