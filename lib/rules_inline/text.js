// Skip text characters for text token, place those to pendibg buffer
// and increment current pos

module.exports = function text(state, silent) {
  var match = state.src.slice(state.pos).match(state.parser.textMatch);

  if (!match) { return false; }

  if (!silent) { state.pending += match[0]; }
  state.pos += match[0].length;

  return true;
};
