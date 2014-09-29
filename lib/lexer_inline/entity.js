// Proceess html entity - &#123;, &#xAF;, &quot;, ...

'use strict';

var entities          = require('../common/entities');
var escapeHtml        = require('../helpers').escapeHtml;
var isValidEntityCode = require('../helpers').isValidEntityCode;
var fromCodePoint     = require('../helpers').fromCodePoint;


var DIGITAL_RE = /^(?:x[a-f0-9]{1,8}|[0-9]{1,8});/i;
var NAMED_RE   = /^([a-z][a-z0-9]{1,31});/i;


module.exports = function entity(state) {
  var ch, code, match, pos = state.pos, max = state.posMax;

  if (state.src.charCodeAt(pos) !== 0x26/* & */) { return false; }

  pos++;

  if (pos >= max) {
    state.pending += '&amp;';
    state.pos++;
    return true;
  }

  ch = state.src.charCodeAt(pos);

  if (ch === 0x23 /* # */) {
    match = state.src.slice(pos + 1).match(DIGITAL_RE);
    if (match) {
      code = match[0][0].toLowerCase() === 'x' ? parseInt(match[0].slice(1), 16) : parseInt(match[0], 10);
      state.pending += isValidEntityCode(code) ? escapeHtml(fromCodePoint(code)) : fromCodePoint(0xFFFD);
      state.pos += match[0].length + 2;
      return true;
    }
  } else {
    match = state.src.slice(pos).match(NAMED_RE);
    if (match) {
      if (entities.hasOwnProperty(match[1])) {
        state.pending += escapeHtml(entities[match[1]]);
        state.pos += match[0].length + 1;
        return true;
      }
    }
  }

  state.pending += '&amp;';
  state.pos++;
  return true;
};
