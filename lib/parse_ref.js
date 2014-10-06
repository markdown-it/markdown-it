
'use strict';


var StateInline = require('./lexer_inline/state_inline');
var links = require('./lexer_inline/links');
var skipSpaces = require('./helpers').skipSpaces;


// Parse link reference definition.
//
module.exports = function parse_reference(str, lexer, options, env) {
  var state, labelEnd, pos, max, code, start, href, title, label;

  if (str.charCodeAt(0) !== 0x5B/* [ */) { return -1; }

  // TODO: benchmark this
  if (str.indexOf(']:') === -1) { return -1; }

  state = new StateInline(str, lexer, options, env);
  labelEnd = links.parseLinkLabel(state, 0);

  if (labelEnd < 0 || str.charCodeAt(labelEnd + 1) !== 0x3A/* : */) { return -1; }

  max = state.posMax;

  // [label]:   destination   'title'
  //         ^^^ skip optional whitespace here
  for (pos = labelEnd + 2; pos < max; pos++) {
    code = state.src.charCodeAt(pos);
    if (code !== 0x20 && code !== 0x0A) { break; }
  }

  // [label]:   destination   'title'
  //            ^^^^^^^^^^^ parse this
  href = links.parseLinkDestination(state, pos);
  if (href === null) { return -1; }
  pos = state.pos;

  // [label]:   destination   'title'
  //                       ^^^ skipping those spaces
  start = pos;
  for (pos = pos + 1; pos < max; pos++) {
    code = state.src.charCodeAt(pos);
    if (code !== 0x20 && code !== 0x0A) { break; }
  }

  // [label]:   destination   'title'
  //                          ^^^^^^^ parse this
  if (pos < max && start !== pos && (title = links.parseLinkTitle(state, pos)) !== null) {
    pos = state.pos;
  } else {
    title = '';
    pos = start;
  }

  // ensure that the end of the line is empty
  pos = skipSpaces(state, pos);
  if (pos < max && state.src.charCodeAt(pos) !== 0x0A) { return -1; }

  label = links.normalizeReference(str.slice(1, labelEnd));
  env.references[label] = env.references[label] || { title: title, href: href };

  return pos;
};
