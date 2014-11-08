'use strict';

module.exports = function block(state) {
  state.block.parse(state.src, state.options, state.env, state.tokens);
};
