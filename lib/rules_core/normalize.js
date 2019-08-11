// Normalize input string

'use strict';


var NEWLINES_RE  = /\r[\n\x85]?|[\u2424\x85]/g;
var NULL_RE      = /\0/g;


module.exports = function normalize(state) {
  var str;

  // Normalize newlines
  str = state.src.replace(NEWLINES_RE, '\n');

  // Replace NULL characters
  str = str.replace(NULL_RE, '\uFFFD');

  state.src = str;
};
