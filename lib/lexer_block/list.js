// Lists

'use strict';


var isEmpty        = require('../helpers').isEmpty;
var skipSpaces     = require('../helpers').skipSpaces;
var skipEmptyLines = require('../helpers').skipEmptyLines;


// Search `[-+*][\n ]`, returns next pos arter marker on success
// or -1 on fail.
function skipBulletListMarker(state, startLine) {
  var marker, pos, max;


  if (state.tShift[startLine] > 3) { return -1; }

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

// Search `\d+\.[\n ]`, returns next pos arter marker on success
// or -1 on fail.
function skipOrderedListMarker(state, startLine) {
  var ch,
      pos = state.bMarks[startLine] + state.tShift[startLine],
      max = state.eMarks[startLine];

  if (pos + 1 >= max) { return -1; }

  ch = state.src.charCodeAt(pos++);

  // First char should be non zero digit
  if (ch < 0x31/* 1 */ || ch > 0x39/* 9 */) { return -1; }

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
  var line,
      nextLine,
      indent,
      start,
      posAfterMarker,
      max,
      indentAfterMarker,
      markerValue,
      isOrdered,
      lastNonEmptyLine,
      hasNextItem,
      subState,
      posNext,
      contentStart,
      rules_named = state.lexerBlock.rules_named;

  // Detect list type and position after marker
  if ((posAfterMarker = skipOrderedListMarker(state, startLine)) >= 0) {
    isOrdered = true;
  } else if ((posAfterMarker = skipBulletListMarker(state, startLine)) >= 0) {
    isOrdered = false;
  } else {
    return false;
  }

  // For validation mode we can terminate immediately
  if (silent) { return true; }

  // Start list
  if (isOrdered) {
    start = state.bMarks[startLine] + state.tShift[startLine];
    markerValue = Number(state.src.substr(start, posAfterMarker - start - 1));

    state.tokens.push({
      type: 'ordered_list_open',
      order: markerValue
    });

  } else {
    state.tokens.push({ type: 'bullet_list_open' });
  }

  //
  // Iterate list items
  //

  line = startLine;
  nextLine = line + 1;

  while (line < endLine) {

    contentStart = skipSpaces(state, posAfterMarker);
    max = state.eMarks[line];

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
    indent = (posAfterMarker - state.tShift[line]) + indentAfterMarker;

    //
    // Scan lines inside list items
    //
    lastNonEmptyLine = line;
    hasNextItem = false;

    for (; nextLine < endLine; nextLine++) {
      if (isEmpty(state, nextLine)) {
        // TODO: check right fenced code block
        // Problem - can be in nested list, should detect indent right

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

      //
      // if we are here, then next line is not empty and not last.
      //

      // Check that list is not terminated with another block type
      if (rules_named.fences(state, nextLine, endLine, true)) { break; }
      if (rules_named.hr(state, nextLine, endLine, true)) { break; }

      //////////////////////////////////////////////////////////////////////////
      // In other block types this check (block ot the same type) is skipped.

      // check if next item of the same type exists,
      // and remember the new position after marker
      if (isOrdered) {
        posNext = skipOrderedListMarker(state, nextLine);
      } else {
        posNext = skipBulletListMarker(state, nextLine);
      }
      if (posNext >= 0) {
        hasNextItem = true;
        break;
      }
      // Another type of list item - need to terminate this list.
      if (rules_named.list(state, nextLine, endLine, true)) { break; }

      //////////////////////////////////////////////////////////////////////////


      if (rules_named.heading(state, nextLine, endLine, true)) { break; }
      if (rules_named.lheading(state, nextLine, endLine, true)) { break; }
      if (rules_named.blockquote(state, nextLine, endLine, true)) { break; }
      if (rules_named.table(state, nextLine, endLine, true)) { break; }
      //if (rules_named.tag(state, nextLine, endLine, true)) { break; }
      //if (rules_named.def(state, nextLine, endLine, true)) { break; }

      lastNonEmptyLine = nextLine;
    }

    // Run sublexer & write tokens
    state.tokens.push({ type: 'list_item_open' });

    // TODO: need to detect loose type.
    // Problem: blocks. separated by empty lines can be member of sublists.

    subState = state.clone(state.src.slice(
                                      contentStart,
                                      state.eMarks[lastNonEmptyLine])
                                    .replace(RegExp('^ {1,' + indent + '}', 'mg'), ''));
    state.lexerBlock.tokenize(subState, 0, subState.lineMax);
    state.tokens.push({ type: 'list_item_close' });

    if (!hasNextItem) { break; }

    posAfterMarker = posNext;
    line = nextLine;
    nextLine++;
  }

  // Finilize list
  if (isOrdered) {
    state.tokens.push({ type: 'ordered_list_close' });
  } else {
    state.tokens.push({ type: 'bullet_list_close' });
  }

  state.line = skipEmptyLines(state, nextLine);
  return true;
};
