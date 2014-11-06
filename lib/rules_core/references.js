'use strict';

var parseRef = require('../parser_ref');

module.exports = function references(state) {
  var tokens = state.tokens, i, l, content, pos;

  state.env.references = state.env.references || {};

  // Scan definitions in paragraph inlines
  for (i = 1, l = tokens.length - 1; i < l; i++) {
    if (tokens[i].type === 'inline' &&
        tokens[i - 1].type === 'paragraph_open' &&
        tokens[i + 1].type === 'paragraph_close') {

      content = tokens[i].content;
      while (content.length) {
        pos = parseRef(content, state.inline, state.options, state.env);
        if (pos < 0) { break; }
        content = content.slice(pos).trim();
      }

      tokens[i].content = content;
      if (!content.length) {
        tokens[i - 1].tight = true;
        tokens[i + 1].tight = true;
      }
    }
  }
};
