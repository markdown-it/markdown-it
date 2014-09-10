// Common functions for lexers

'use strict';


function isWhiteSpace(ch) {
  return ch === 0x20;
}

// Check if line has zero length or contains spaces only
function isEmpty(state, line) {
  return state.bMarks[line] + state.tShift[line] >= state.eMarks[line];
}

// Scan lines from given one and return first not empty
function skipEmptyLines(state, from) {
  for (var max = state.lineMax; from < max; from++) {
    if (state.bMarks[from] + state.tShift[from] < state.eMarks[from]) {
      break;
    }
  }
  return from;
}

// Skip spaces from given position.
function skipSpaces(state, pos) {
  for (var max = state.src.length; pos < max; pos++) {
    if (!isWhiteSpace(state.src.charCodeAt(pos))) { break; }
  }
  return pos;
}

// Skip char codes from given position
function skipChars(state, pos, code) {
  for (var max = state.src.length; pos < max; pos++) {
    if (state.src.charCodeAt(pos) !== code) { break; }
  }
  return pos;
}

// Skip char codes reverse from given position - 1
function skipCharsBack(state, pos, code, min) {
  if (pos <= min) { return pos; }

  while (pos > min) {
    if (code !== state.src.charCodeAt(--pos)) { return pos + 1; }
  }
  return pos;
}

// cut lines range from source.
function getLines(state, begin, end, keepLastLF) {
  var last;

  if (keepLastLF) {
    last = end < state.lineMax ? state.bMarks[end] : state.src.length;
  } else {
    last = end < state.lineMax ? state.eMarks[end - 1] : state.src.length;
  }

  return state.src.slice(state.bMarks[begin], last);
}

exports.isWhiteSpace = isWhiteSpace;
exports.isEmpty = isEmpty;
exports.skipEmptyLines = skipEmptyLines;
exports.skipSpaces = skipSpaces;
exports.skipChars = skipChars;
exports.getLines = getLines;
exports.skipCharsBack = skipCharsBack;
