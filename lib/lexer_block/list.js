// Lists

'use strict';


var isEmpty    = require('../helpers').isEmpty;
var skipSpaces = require('../helpers').skipSpaces;


// Search `[-+*][\n ]`, returns next pos arter marker on success
// or -1 on fail.
function skipBulletListMarker(state, startLine) {
  var marker, pos, max;

  pos = state.bMarks[startLine] + state.tShift[startLine];
  max = state.eMarks[startLine];

  if (pos >= max) { return -1; }

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

// Search `\d+[.)][\n ]`, returns next pos arter marker on success
// or -1 on fail.
function skipOrderedListMarker(state, startLine) {
  var ch,
      pos = state.bMarks[startLine] + state.tShift[startLine],
      max = state.eMarks[startLine];

  if (pos + 1 >= max) { return -1; }

  ch = state.src.charCodeAt(pos++);

  if (ch < 0x30/* 0 */ || ch > 0x39/* 9 */) { return -1; }

  for (;;) {
    // EOL -> fail
    if (pos >= max) { return -1; }

    ch = state.src.charCodeAt(pos++);

    if (ch >= 0x30/* 0 */ && ch <= 0x39/* 9 */) {
      continue;
    }

    // found valid marker
    if (ch === 0x29/* ) */ || ch === 0x2e/* . */) {
      break;
    }

    return -1;
  }


  if (pos < max && state.src.charCodeAt(pos) !== 0x20/* space */) {
    // " 1.test " - is not a list item
    return -1;
  }
  return pos;
}


module.exports = function list(state, startLine, endLine, silent) {
  var nextLine,
      indent,
      oldTShift,
      oldIndent,
      oldTight,
      oldListMode,
      start,
      posAfterMarker,
      max,
      indentAfterMarker,
      markerValue,
      markerCharCode,
      isOrdered,
      contentStart,
      listTokIdx,
      prevEmptyEnd,
      rules_named = state.lexer.rules_named;

  // Detect list type and position after marker
  if ((posAfterMarker = skipOrderedListMarker(state, startLine)) >= 0) {
    isOrdered = true;
  } else if ((posAfterMarker = skipBulletListMarker(state, startLine)) >= 0) {
    isOrdered = false;
  } else {
    return false;
  }
  // We should terminate list on style change. Remember first one to compare.
  markerCharCode = state.src.charCodeAt(posAfterMarker - 1);

  // For validation mode we can terminate immediately
  if (silent) { return true; }

  // Start list
  listTokIdx = state.tokens.length;

  if (isOrdered) {
    start = state.bMarks[startLine] + state.tShift[startLine];
    markerValue = Number(state.src.substr(start, posAfterMarker - start - 1));

    state.tokens.push({
      type: 'ordered_list_open',
      order: markerValue,
      tight: true
    });

  } else {
    state.tokens.push({
      type: 'bullet_list_open',
      tight: true
    });
  }

  //
  // Iterate list items
  //

  nextLine = startLine;
  prevEmptyEnd = false;

  while (nextLine < endLine) {
    contentStart = skipSpaces(state, posAfterMarker);
    max = state.eMarks[nextLine];

    if (contentStart >= max) {
      // trimming space in "-    \n  3" case, indent is 1 here
      indentAfterMarker = 1;
    } else {
      indentAfterMarker = contentStart - posAfterMarker;
    }

    // If we have more than 4 spaces, the indent is 1
    // (the rest is just indented code block)
    if (indentAfterMarker > 4) { indentAfterMarker = 1; }

    // If indent is less than 1, assume that it's one, example:
    //  "-\n  test"
    if (indentAfterMarker < 1) { indentAfterMarker = 1; }

    // "  -  test"
    //  ^^^^^ - calculating total length of this thing
    indent = (posAfterMarker - state.bMarks[nextLine]) + indentAfterMarker;

    // Run sublexer & write tokens
    state.tokens.push({ type: 'list_item_open' });

    //nextLine++;

    oldIndent = state.blkIndent;
    oldTight = state.tight;
    oldTShift = state.tShift[startLine];
    oldListMode = state.listMode;
    state.tShift[startLine] = contentStart - state.bMarks[startLine];
    state.blkIndent = indent;
    state.tight = true;
    state.listMode = true;

    state.lexer.tokenize(state, startLine, endLine, true);

    // If any of list item is tight, mark list as tight
    if (!state.tight || prevEmptyEnd) {
      state.tokens[listTokIdx].tight = false;
    }
    // Item become loose if finish with empty line,
    // but we should filter last element, because it means list finish
    prevEmptyEnd = (state.line - startLine) > 1 && isEmpty(state, state.line - 1);

    state.blkIndent = oldIndent;
    state.tShift[startLine] = oldTShift;
    state.tight = oldTight;
    state.listMode = oldListMode;

    state.tokens.push({ type: 'list_item_close' });

    nextLine = startLine = state.line;
    contentStart = state.bMarks[startLine];

    if (nextLine >= endLine) { break; }

    if (isEmpty(state, nextLine)) {
      if (nextLine >= endLine || isEmpty(state, nextLine)) {
        // two newlines end the list
        break;
      } else {
        nextLine++;
      }
    }

    //
    // Try to check if list is terminated or continued.
    //
    if (state.tShift[nextLine] < state.blkIndent) { break; }
    if (state.bqMarks[nextLine] < state.bqLevel) { break; }

    // fail if terminating block found
    if (rules_named.fences(state, nextLine, endLine, true)) { break; }
    if (rules_named.blockquote(state, nextLine, endLine, true)) { break; }
    if (rules_named.hr(state, nextLine, endLine, true)) { break; }

    // fail if list has another type
    if (isOrdered) {
      posAfterMarker = skipOrderedListMarker(state, nextLine);
      if (posAfterMarker < 0) { break; }
    } else {
      posAfterMarker = skipBulletListMarker(state, nextLine);
      if (posAfterMarker < 0) { break; }
    }

    if (markerCharCode !== state.src.charCodeAt(posAfterMarker - 1)) { break; }
  }

  // Finilize list
  if (isOrdered) {
    state.tokens.push({ type: 'ordered_list_close' });
  } else {
    state.tokens.push({ type: 'bullet_list_close' });
  }

  state.line = nextLine;
  return true;
};
