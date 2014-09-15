// Proceess html entity - &#123, &#xAF, &quot


var DIGITAL_RE = /^(?:x[a-f0-9]{1,8}|[0-9]{1,8});/i;
var NAMED_RE   = /^[a-z][a-z0-9]{1,31};/i;


module.exports = function entity(state) {
  var ch, match, pos = state.pos, max = state.posMax;


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
      state.pending += '&#' + match[0];
      state.pos += match[0].length + 2;
      return true;
    }
  } else {
    match = state.src.slice(pos).match(NAMED_RE);
    if (match) {
      state.pending += '&' + match[0];
      state.pos += match[0].length + 1;
      return true;
    }
  }

  state.pending += '&amp;';
  state.pos++;
  return true;
};
