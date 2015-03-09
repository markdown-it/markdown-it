'use strict';


module.exports = function block(state) {
  var token;

  if (state.inlineMode) {
    token          = state.push('inline', '', 0);
    token.content  = state.src;
    token.map      = [ 0, 1 ];
    token.children = [];
  } else {
    state.md.block.parse(state.src, state.md, state.env, state.tokens);
  }
};
