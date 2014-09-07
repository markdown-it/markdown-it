// Lists

'use strict';


var isEmpty = require('../helpers').isEmpty;
var skipEmptyLines = require('../helpers').skipEmptyLines;


function bullet_item(state, startLine, endLine, silent) {
  var marker, nextLine,
      rules_named = state.lexerBlock.rules_named,
      pos = state.bMarks[startLine] + state.tShift[startLine],
      max = state.eMarks[startLine];

  // TODO: supporting list with only one paragraph for now

  if (pos > max) { return false; }

  marker = state.src.charCodeAt(pos++);

  // Check bullet
  if (marker !== 0x2A/* * */ &&
      marker !== 0x2D/* - */ &&
      marker !== 0x2B/* + */) {
    return false;
  }

  // Empty list item
  if (pos > max) {
    state.tokens.push({ type: 'list_item_open' });
    state.tokens.push({ type: 'list_item_close' });
    return true;
  }

  if (state.src.charCodeAt(pos++) !== 0x20) { return false; }

  // If we reached this, it's surely a list item
  if (silent) { return true; }

  nextLine = startLine + 1;

  // jump line-by-line until empty one or EOF
  while (nextLine < endLine && !isEmpty(state, nextLine)) {
    // Some tags can terminate paragraph without empty line.
    // Try those tags in validation more (without tokens generation)
    if (rules_named.fences(state, nextLine, endLine, true)) { break; }
    if (rules_named.hr(state, nextLine, endLine, true)) { break; }
    if (rules_named.heading(state, nextLine, endLine, true)) { break; }
    if (rules_named.lheading(state, nextLine, endLine, true)) { break; }
    if (rules_named.blockquote(state, nextLine, endLine, true)) { break; }
    if (bullet_item(state, nextLine, endLine, true)) { break; }
    //if (rules_named.tag(state, nextLine, endLine, true)) { break; }
    //if (rules_named.def(state, nextLine, endLine, true)) { break; }
    nextLine++;
  }

  state.tokens.push({ type: 'list_item_open' });
  state.lexerInline.tokenize(
    state,
    state.bMarks[startLine],
    state.eMarks[nextLine - 1]
  );
  state.tokens.push({ type: 'list_item_close' });

  state.line = skipEmptyLines(state, nextLine);
  return true;
}

module.exports = function list(state, startLine, endLine, silent) {
  // TODO: supporting list with only one element for now
  if (bullet_item(state, startLine, endLine, true)) {
    if (silent) { return true; }
    state.tokens.push({ type: 'bullet_list_open' });
    bullet_item(state, startLine, endLine);
    state.tokens.push({ type: 'bullet_list_close' });
    return true;
  }
  return false;
};
