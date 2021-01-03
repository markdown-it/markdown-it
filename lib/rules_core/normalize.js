// Normalize input string

'use strict';


// https://spec.commonmark.org/0.29/#line-ending
var CRLF_RE = /\r\n?/g;


module.exports = function normalize(state) {
  var src = state.src;

  // Normalize CRLF newlines
  src = src.replace(CRLF_RE, '\n');

  // Replace NULL characters
  for (var i = 0, l = src.length; i < l; i++) {
    if (!src.charCodeAt(i)) {
      src = src.slice (0, i) + '\uFFFD' + src.slice (i + 1);
    }
  }

  state.src = src;
};
