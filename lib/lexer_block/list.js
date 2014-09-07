// Lists

'use strict';


var isEmpty        = require('../helpers').isEmpty;
var getLines       = require('../helpers').getLines;
var skipSpaces     = require('../helpers').skipSpaces;
var skipEmptyLines = require('../helpers').skipEmptyLines;


function findEndOfItem(state, startLine, endLine, indent) {
  var lastNonEmptyLine = startLine,
      rules_named = state.lexerBlock.rules_named,
      nextLine = startLine + 1;

  // jump line-by-line until empty one or EOF
  for (; nextLine < endLine; nextLine++) {
    if (isEmpty(state, nextLine)) {
      // two successive newlines end the list
      if (lastNonEmptyLine < nextLine - 1) { break; }
      continue;
    }

    // if this line is indented more than with N spaces,
    // it's the new paragraph of the same list item
    if (state.tShift[nextLine] >= indent) {
      lastNonEmptyLine = nextLine;
      continue;
    }

    // paragraph after linebreak - not a continuation
    if (lastNonEmptyLine < nextLine - 1) { break; }

    // Otherwise it's a possible continuation, so we need to check
    // other tags, same as with blockquote and paragraph.

    if (rules_named.fences(state, nextLine, endLine, true)) { break; }
    if (rules_named.hr(state, nextLine, endLine, true)) { break; }
    if (rules_named.heading(state, nextLine, endLine, true)) { break; }
    if (rules_named.lheading(state, nextLine, endLine, true)) { break; }
    if (rules_named.blockquote(state, nextLine, endLine, true)) { break; }
    if (rules_named.list(state, nextLine, endLine, true)) { break; }
    //if (rules_named.tag(state, nextLine, endLine, true)) { break; }
    //if (rules_named.def(state, nextLine, endLine, true)) { break; }
    lastNonEmptyLine = nextLine;
  }
  return lastNonEmptyLine;
}

// skips `[-+*][\n ]`, returns -1 if not found
function skipBulletListMarker(state, startLine/*, endLine*/) {
  var marker,
      pos = state.bMarks[startLine] + state.tShift[startLine],
      max = state.eMarks[startLine];

  if (pos > max) { return -1; }

  marker = state.src.charCodeAt(pos++);
  // Check bullet
  if (marker !== 0x2A/* * */ &&
      marker !== 0x2D/* - */ &&
      marker !== 0x2B/* + */) {
    return -1;
  }

  if (pos < max && state.src.charCodeAt(pos) !== 0x20) {
    // " 1.test " - is not a list item
    return -1;
  }
  return pos;
}

// skips `\d+\.[\n ]`, returns -1 if not found
function skipOrderedListMarker(state, startLine/*, endLine*/) {
  var marker,
      haveMarker = false,
      pos = state.bMarks[startLine] + state.tShift[startLine],
      max = state.eMarks[startLine];

  if (pos + 1 > max) { return -1; }

  marker = state.src.charCodeAt(pos++);
  if (marker < 0x30/* 0 */ || marker > 0x39/* 9 */) { return -1; }

  while (pos < max) {
    marker = state.src.charCodeAt(pos++);

    // found valid marker
    if (marker === 0x29 || marker === 0x2e) {
      haveMarker = true;
      break;
    }

    // still skipping digits...
    if (marker < 0x30/* 0 */ || marker > 0x39/* 9 */) { return -1; }
  }

  if (!haveMarker) {
    // " 1\n"
    return -1;
  }
  if (pos < max && state.src.charCodeAt(pos) !== 0x20) {
    // " 1.test " - is not a list item
    return -1;
  }
  return pos;
}

function bullet_item(state, startLine, endLine, isOrdered) {
  var indentAfterMarker, indent, start, lastLine, subState, pos,
      max = state.eMarks[startLine];

  if (isOrdered) {
    pos = skipOrderedListMarker(state, startLine, endLine);
  } else {
    pos = skipBulletListMarker(state, startLine, endLine);
  }

  if (pos === -1) { return false; }

  start = pos;
  pos = skipSpaces(state, pos);

  if (pos >= max) {
    // trimming space in "-    \n  3" case, indent is 1 here
    indentAfterMarker = 1;
  } else {
    indentAfterMarker = pos - start;
  }

  // If we have more than 4 spaces, the indent is 1
  // (the rest is just indented code block)
  if (indentAfterMarker > 4) { indentAfterMarker = 1; }

  // If indent is less than 1, assume that it's one, example:
  //  "-\n  test"
  if (indentAfterMarker < 1) { indentAfterMarker = 1; }

  // "  -  test"
  //  ^^^^^ - calculating total length of this thing
  indent = state.tShift[startLine] + indentAfterMarker + (isOrdered ? 2 : 1);

  lastLine = findEndOfItem(state, startLine, endLine, indent);

  state.tokens.push({ type: 'list_item_open' });
  /*state.lexerInline.tokenize(
    state,
    state.bMarks[startLine],
    state.eMarks[lastLine]
  );*/
  subState = state.clone(getLines(state, startLine, lastLine + 1, true)
              .replace(RegExp('^ {' + indent + '}', 'mg'), '').substr(indent));
  state.lexerBlock.tokenize(subState, 0, subState.lineMax);

  state.tokens.push({ type: 'list_item_close' });

  state.line = lastLine + 1;
  return true;
}

module.exports = function list(state, startLine, endLine, silent) {
  var line, start, markerInt,
      orderedMarker = skipOrderedListMarker(state, startLine, endLine),
      bulletMarker = skipBulletListMarker(state, startLine, endLine),
      isOrdered;

  if (orderedMarker === -1 && bulletMarker === -1) { return false; }
  if (silent) { return true; }

  isOrdered = orderedMarker !== -1;
  if (isOrdered) {
    start = state.bMarks[startLine] + state.tShift[startLine];
    markerInt = Number(state.src.substr(start, orderedMarker - start));
    if (markerInt > 1) {
      state.tokens.push({ type: 'ordered_list_open', start: markerInt });
    } else {
      state.tokens.push({ type: 'ordered_list_open' });
    }
  } else {
    state.tokens.push({ type: 'bullet_list_open' });
  }

  line = startLine;
  while (line < endLine) {
    if (bullet_item(state, line, endLine, isOrdered)) {
      line = state.line;

      // if we have a trailing newline, skip it;
      // if we have more than one, it should end the list,
      // so can't use skipEmptyNewlines here
      if (line < endLine && isEmpty(state, line)) { line++; }
    } else {
      break;
    }
  }

  if (isOrdered) {
    state.tokens.push({ type: 'ordered_list_close' });
  } else {
    state.tokens.push({ type: 'bullet_list_close' });
  }
  state.line = skipEmptyLines(state, state.line);
  return true;
};
