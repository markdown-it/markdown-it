'use strict';

module.exports = function block(state) {
  var tokens = state.block.parse(state.src, state.options, state.env);
  state.tokens = state.tokens.concat(tokens);
};
