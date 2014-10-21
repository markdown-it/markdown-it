// Process < > " (& was processed in markdown escape)

module.exports = function escape_html_char(state, silent) {
  var ch = state.src.charCodeAt(state.pos),
      str;

  if (ch === 0x3C/* < */) {
    str = '&lt;';
  } else if (ch === 0x3E/* > */) {
    str = '&gt;';
  } else if (ch === 0x22/* " */) {
    str = '&quot;';
  } else {
    return false;
  }

  if (!silent) { state.pending += str; }
  state.pos++;
  return true;
};
