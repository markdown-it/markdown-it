// Proceess escaped chars and hardbreaks

var ESCAPED = '\\!"#$%&\'()*+,./:;<=>?@[]^_`{|}~-'
                      .split('')
                      .map(function(ch) { return ch.charCodeAt(0); });

module.exports = function escape(state) {
  var ch, pos = state.pos, max = state.posMax;

  if (state.src.charCodeAt(pos) !== 0x5C/* \ */) { return false; }

  pos++;

  if (pos < max) {
    ch = state.src.charCodeAt(pos);

    if (ESCAPED.indexOf(ch) >= 0) {
      // escape html chars if needed
      if (ch === 0x26/* & */) {
        state.pending += '&amp;';
      } else if (ch === 0x3C/* < */) {
        state.pending += '&lt;';
      } else if (ch === 0x3E/* > */) {
        state.pending += '&gt;';
      } else if (ch === 0x22/* " */) {
        state.pending += '&quot;';
      } else {
        state.pending += state.src[pos];
      }
      state.pos += 2;
      return true;
    }

    if (ch === 0x0A) {
      state.push({
        type: 'hardbreak'
      });

      pos++;
      // skip leading whitespaces from next line
      while (pos < max && state.src.charCodeAt(pos) === 0x20) { pos++; }

      state.pos = pos;
      return true;
    }
  }

  state.pending += '\\';
  state.pos++;
  return true;
};
