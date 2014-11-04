'use strict';

module.exports = function typographer(state) {
  if (!state.options.typographer) { return; }

  state.typographer.process(state);
};
