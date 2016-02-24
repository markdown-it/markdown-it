'use strict';

module.exports = function inline(state) {
  var tokens = state.tokens, tok, i, l;

  // Parse inlines
  for (i = 0, l = tokens.length; i < l; i++) {
    tok = tokens[i];
    if (tok.type === 'inline') {
      state.md.inline.parse(tok.content, state.md, state.env, tok.children);

      // Update position of all children to be absolute
      for (var child = 0; child < tok.children.length; child++) {
        tok.children[child].position = tok.children[child].position + tok.position;
      }
    }
  }
};
