// Parse abbreviation definitions, i.e. `*[abbr]: description`
//

'use strict';


module.exports = function parseAbbr(state, startLine, endLine, silent) {
  var label, title, ch, labelStart, labelEnd,
      pos = state.bMarks[startLine] + state.tShift[startLine],
      max = state.eMarks[startLine];

  if (pos + 2 >= max) { return false; }

  if (state.src.charCodeAt(pos++) !== 0x2A/* * */) { return false; }
  if (state.src.charCodeAt(pos++) !== 0x5B/* [ */) { return false; }

  labelStart = pos;

  for (; pos < max; pos++) {
    ch = state.src.charCodeAt(pos);
    if (ch === 0x5B /* [ */) {
      return false;
    } else if (ch === 0x5D /* ] */) {
      labelEnd = pos;
      break;
    } else if (ch === 0x5C /* \ */) {
      pos++;
    }
  }

  if (labelEnd < 0 || state.src.charCodeAt(labelEnd + 1) !== 0x3A/* : */) {
    return false;
  }

  if (silent) { return true; }

  label = state.src.slice(labelStart, labelEnd).replace(/\\(.)/g, '$1');
  title = state.src.slice(labelEnd + 2, max).trim();
  if (title.length === 0) { return false; }
  if (!state.env.abbreviations) { state.env.abbreviations = {}; }
  // prepend ':' to avoid conflict with Object.prototype members
  if (typeof state.env.abbreviations[':' + label] === 'undefined') {
    state.env.abbreviations[':' + label] = title;
  }

  state.line = startLine + 1;
  return true;
};
