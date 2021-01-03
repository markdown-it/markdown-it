// Clean up tokens after emphasis and strikethrough postprocessing:
// merge adjacent text nodes into one and re-calculate all token levels
//
// This is necessary because initially emphasis delimiter markers (*, _, ~)
// are treated as their own separate text tokens. Then emphasis rule either
// leaves them as text (needed to merge with adjacent text) or turns them
// into opening/closing tags (which messes up levels inside).
//
'use strict';


module.exports = function text_collapse(state) {
  var curr, last, token,
      level = 0,
      tokens = state.tokens,
      max = tokens.length;

  for (curr = last = 0; curr < max; curr++) {
    token = tokens[curr];
    // re-calculate levels after emphasis/strikethrough turns some text nodes
    // into opening/closing tags
    if (token.nesting < 0) level--; // closing tag
    token.level = level;
    if (token.nesting > 0) level++; // opening tag

    if (token.type === 'text' &&
        curr + 1 < max &&
        tokens[curr + 1].type === 'text') {

      // collapse two adjacent text nodes
      tokens[curr + 1].content = token.content + tokens[curr + 1].content;
    } else {
      if (curr !== last) { tokens[last] = token; }

      last++;
    }
  }

  if (curr !== last) {
    tokens.length = last;
  }
};
