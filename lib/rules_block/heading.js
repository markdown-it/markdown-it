// heading (#, ##, ...)

'use strict';


module.exports = function heading(state, startLine, endLine, silent) {
  var ch, level,
      pos = state.bMarks[startLine] + state.tShift[startLine],
      max = state.eMarks[startLine];

  if (pos >= max) { return false; }

  ch  = state.src.charCodeAt(pos);

  if (ch !== 0x23/* # */ || pos >= max) { return false; }

  // count heading level
  level = 1;
  ch = state.src.charCodeAt(++pos);
  while (ch === 0x23/* # */ && pos < max && level <= 6) {
    level++;
    ch = state.src.charCodeAt(++pos);
  }

  if (level > 6 || (pos < max && ch !== 0x20/* space */)) { return false; }

  // skip spaces before heading text
  pos = state.skipSpaces(pos);

  // Now pos contains offset of first heared char
  // Let's cut tails like '    ###  ' from the end of string

  max = state.skipCharsBack(max, 0x20/* space */, pos);
  max = state.skipCharsBack(max, 0x23/* # */, pos);

  if (max < state.eMarks[startLine] &&
      state.src.charCodeAt(max) === 0x23/* # */ &&
      state.src.charCodeAt(max - 1) === 0x5C/* \ */) {
    max++;
  }

  // ## Foo   ####
  //       ^^^
  max = state.skipCharsBack(max, 0x20/* space */, pos);

  if (silent) { return true; }

  state.line = startLine + 1;

  state.tokens.push({ type: 'heading_open',
    hLevel: level,
    lines: [ startLine, state.line ],
    level: state.level
  });

  // only if header is not empty
  if (pos < max) {
    state.tokens.push({
      type: 'inline',
      content: state.src.slice(pos, max).trim(),
      level: state.level + 1,
      lines: [ startLine, state.line ],
      children: []
    });
  }
  state.tokens.push({ type: 'heading_close', hLevel: level, level: state.level });

  return true;
};
