// Process html tags

'use strict';


var HTML_TAG_RE = require('../common/html_re').HTML_TAG_RE;

var COMMENT_RE = /^<!--[\s\S]*?-->$/;

function isLetter(ch) {
  /*eslint no-bitwise:0*/
  var lc = ch | 0x20; // to lower case
  return (lc >= 0x61/* a */) && (lc <= 0x7a/* z */);
}


module.exports = function html_inline(state, silent) {
  var ch, match, max, content, pos = state.pos;

  if (!state.md.options.html) { return false; }

  // Check start
  max = state.posMax;
  if (state.src.charCodeAt(pos) !== 0x3C/* < */ ||
      pos + 2 >= max) {
    return false;
  }

  // Quick fail on second char
  ch = state.src.charCodeAt(pos + 1);
  if (ch !== 0x21/* ! */ &&
      ch !== 0x3F/* ? */ &&
      ch !== 0x2F/* / */ &&
      !isLetter(ch)) {
    return false;
  }

  match = state.src.slice(pos).match(HTML_TAG_RE);
  if (!match) { return false; }

  content = state.src.slice(pos, pos + match[0].length);

  // Additional check for comments
  if (COMMENT_RE.test(content)) {
    if (/(^>|^->|--|-$)/.test(content.slice(4, -3))) { return false; }
  }

  if (!silent) {
    state.push({
      type: 'html_inline',
      content: content,
      level: state.level
    });
  }
  state.pos += match[0].length;
  return true;
};
