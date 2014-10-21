// Proceess escaped chars and hardbreaks

var ESCAPED = {};

'\\!"#$%&\'()*+,./:;<=>?@[]^_`{|}~-'
  .split('').forEach(function(ch) { ESCAPED[ch.charCodeAt(0)] = true; });

module.exports = function escape(state, silent) {
  var ch, str, pos = state.pos, max = state.posMax;

  if (state.src.charCodeAt(pos) !== 0x5C/* \ */) { return false; }

  pos++;

  if (pos < max) {
    ch = state.src.charCodeAt(pos);

    if (typeof ESCAPED[ch] !== 'undefined') {
      // escape html chars if needed
      if (ch === 0x26/* & */) {
        str = '&amp;';
      } else if (ch === 0x3C/* < */) {
        str = '&lt;';
      } else if (ch === 0x3E/* > */) {
        str = '&gt;';
      } else if (ch === 0x22/* " */) {
        str = '&quot;';
      } else {
        str = state.src[pos];
      }
      if (!silent) { state.pending += str; }
      state.pos += 2;
      return true;
    }

    if (ch === 0x0A) {
      if (!silent) {
        state.push({
          type: 'hardbreak',
          level: state.level
        });
      }

      pos++;
      // skip leading whitespaces from next line
      while (pos < max && state.src.charCodeAt(pos) === 0x20) { pos++; }

      state.pos = pos;
      return true;
    }
  }

  if (!silent) { state.pending += '\\'; }
  state.pos++;
  return true;
};
