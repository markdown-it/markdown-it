// Normalize input string

'use strict';


// https://spec.commonmark.org/0.29/#line-ending
let NEWLINES_RE  = /\r\n?|\n/g;
let NULL_RE      = /\0/g;


module.exports = function normalize(state) {
  let str;

  // Normalize newlines
  str = state.src.replace(NEWLINES_RE, '\n');

  // Replace NULL characters
  str = str.replace(NULL_RE, '\uFFFD');

  state.src = str;
};
