// Process < > " (& was processed in markdown escape)

module.exports = function escape_html_char(state) {
  var ch = state.src.charCodeAt(state.pos);

  if (ch === 0x3C/* < */) {
    state.pending += '&lt;';
  } else if (ch === 0x3E/* > */) {
    state.pending += '&gt;';
  } else if (ch === 0x22/* " */) {
    state.pending += '&quot;';
  } else {
    return false;
  }

  state.pos++;
  return true;
};
