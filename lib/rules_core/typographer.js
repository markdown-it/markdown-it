'use strict';

module.exports = function typographer(state) {
  if (!state.options.typographer) { return; }
  var tokens = state.tokens, tok, i, l;

  // Parse inlines
  for (i = 0, l = tokens.length; i < l; i++) {
    tok = tokens[i];
    if (tok.type === 'inline') {
      state.typographer.process(tok, state);
    }
  }
};
