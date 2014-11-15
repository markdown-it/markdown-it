// Process footnote references ([^...])

'use strict';


module.exports = function footnote_ref(state, silent) {
  var label,
      pos,
      footnoteId,
      max = state.posMax,
      start = state.pos;

  // should be at least 4 chars - "[^x]"
  if (start + 3 > max) { return false; }

  if (!state.env.footnotes || !state.env.footnotes.available) { return false; }
  if (state.src.charCodeAt(start) !== 0x5B/* [ */) { return false; }
  if (state.src.charCodeAt(start + 1) !== 0x5E/* ^ */) { return false; }
  if (state.level >= state.options.maxNesting) { return false; }

  for (pos = start + 2; pos < max; pos++) {
    if (state.src.charCodeAt(pos) === 0x20) { return false; }
    if (state.src.charCodeAt(pos) === 0x0A) { return false; }
    if (state.src.charCodeAt(pos) === 0x5D /* ] */) {
      break;
    }
  }

  if (pos === start + 2) { return false; } // no empty footnote labels
  if (pos >= max) { return false; }
  pos++;

  label = state.src.slice(start + 2, pos - 1);
  if (!state.env.footnotes.available[label]) { return false; }

  if (!silent) {
    if (!state.env.footnotes.list) { state.env.footnotes.list = []; }
    footnoteId = state.env.footnotes.list.length;

    state.push({
      type: 'footnote_ref',
      id: footnoteId,
      level: state.level
    });

    state.env.footnotes.list[footnoteId] = { label: label };
  }

  state.pos = pos;
  state.posMax = max;
  return true;
};
