// Parse backticks

var END_RE = /`+/g;

module.exports = function backticks(state) {
  var start, code, max, marker, match,
      pos = state.pos,
      ch = state.src.charCodeAt(pos);

  if (ch !== 0x60/* ` */) { return false; }

  start = pos;
  pos++;
  max = state.posMax;

  while (pos < max && state.src.charCodeAt(pos) === 0x60/* ` */) { pos++; }

  marker = state.src.slice(start, pos);

  END_RE = /`+/g;
  END_RE.lastIndex = pos;

  while ((match = END_RE.exec(state.src)) !== null) {
    if (match[0].length === marker.length) {
      code = state.src.slice(pos, END_RE.lastIndex - marker.length);
      state.push({
        type: 'code',
        content: code
                  .replace(/[ \n]+/g,' ')
                  .trim(),
        block: false,
        level: state.level
      });

      state.pos += marker.length * 2 + code.length;
      return true;
    }
  }

  state.pending += marker;
  state.pos += marker.length;
  return true;
};
