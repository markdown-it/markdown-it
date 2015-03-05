'use strict';


var Token = require('../token');


module.exports = function block(state) {
  var token;

  if (state.inlineMode) {
    token          = new Token('inline', '', 0);
    token.content  = state.src;
    token.map      = [ 0, 1 ];
    token.children = [];
    token.level    = 0;

    state.tokens.push(token);
  } else {
    state.md.block.parse(state.src, state.md, state.env, state.tokens);
  }
};
