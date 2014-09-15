// Proceess '\n'

module.exports = function escape(state) {
  var pmax, max, pos = state.pos;

  if (state.src.charCodeAt(pos) !== 0x0A/* \n */) { return false; }

  pmax = state.pending.length - 1;
  max = state.posMax;

  // '  \n' -> hardbreak
  if (pmax >= 1 &&
      state.pending.charCodeAt(pmax) === 0x20 &&
      state.pending.charCodeAt(pmax - 1) === 0x20) {
    state.pending = state.pending.replace(/ +$/, '');
    state.push({
      type: 'hardbreak'
    });

    pos++;
    // skip spaces
    while (pos < max && state.src.charCodeAt(pos) === 0x20) { pos++; }

    state.pos = pos;
    return true;
  }

  if (pmax > 0 && state.pending.charCodeAt(pmax) === 0x20) {
    state.pending = state.pending.replace(/ +$/, '');
  }

  state.pending += '\n';

  pos++;
  // skip spaces
  while (pos < max && state.src.charCodeAt(pos) === 0x20) { pos++; }

  state.pos = pos;
  return true;
};
