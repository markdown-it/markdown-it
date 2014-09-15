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
function getLines(state, begin, end, indent, keepLastLF) {
  var i, first, last, queue,
      line = begin;

  if (begin >= end) {
    return '';
  }

  // Opt: don't use push queue for single line;
  if (line + 1 === end) {
    first = state.bMarks[line] + Math.min(state.tShift[line], indent);
    last = keepLastLF ? state.bMarks[end] : state.eMarks[end - 1];
    return state.src.slice(first, last);
  }

  queue = new Array(end - begin);

  for (i = 0; line < end; line++, i++) {
    first = state.bMarks[line] + Math.min(state.tShift[line], indent);

    if (line + 1 < end || keepLastLF) {
      // TODO: boundary check?
      last = state.eMarks[line] + 1;
    } else {
      last = state.eMarks[line];
    }

    queue[i] = state.src.slice(first, last);
  }

  return queue.join('');
}


function escapeHtml(str) {
  if (str.indexOf('&') >= 0) { str = str.replace(/&/g, '&amp;'); }
  if (str.indexOf('<') >= 0) { str = str.replace(/</g, '&lt;'); }
  if (str.indexOf('>') >= 0) { str = str.replace(/>/g, '&gt;'); }
  if (str.indexOf('"') >= 0) { str = str.replace(/"/g, '&quot;'); }
  return str;
}

function escapeHtmlKeepEntities(str) {
  if (str.indexOf('&') >= 0) {
    str = str.replace(/[&](?![#](x[a-f0-9]{1,8}|[0-9]{1,8});|[a-z][a-z0-9]{1,31};)/gi,'&amp;');
  }
  if (str.indexOf('<') >= 0) { str = str.replace(/</g, '&lt;'); }
  if (str.indexOf('>') >= 0) { str = str.replace(/>/g, '&gt;'); }
  if (str.indexOf('"') >= 0) { str = str.replace(/"/g, '&quot;'); }
  return str;
}

var UNESCAPE_MD_RE = /\\([\\!"#$%&'()*+,.\/:;<=>?@[\]^_`{|}~-])/g;

function unescapeMd(str) {
  if (str.indexOf('\\') < 0) { return str; }
  return str.replace(UNESCAPE_MD_RE, '$1');
}


exports.isWhiteSpace = isWhiteSpace;
exports.isEmpty = isEmpty;
exports.skipEmptyLines = skipEmptyLines;
exports.skipSpaces = skipSpaces;
exports.skipChars = skipChars;
exports.getLines = getLines;
exports.skipCharsBack = skipCharsBack;
exports.escapeHtml = escapeHtml;
exports.unescapeMd = unescapeMd;
exports.escapeHtmlKeepEntities = escapeHtmlKeepEntities;
