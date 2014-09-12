// GFM table, non-standard

'use strict';


function lineMatch(state, line, reg) {
  var pos = state.bMarks[line],
      max = state.eMarks[line];

  return state.src.substr(pos, max - pos).match(reg);
}


module.exports = function table(state, startLine, endLine, silent) {
  var ch, firstLineMatch, secondLineMatch, i, subState, nextLine, m, rows,
      aligns, t;

  // should have at least three lines
  if (startLine + 2 > endLine) { return false; }

  // first character of the second line should be '|' or '-'
  ch = state.src.charCodeAt(state.bMarks[startLine + 1]
     + state.tShift[startLine + 1]);
  if (ch !== 0x7C/* | */ && ch !== 0x2D/* - */) { return false; }

  secondLineMatch = lineMatch(state, startLine + 1,
    /^ *\|?(( *[:-]-+[:-] *\|)+( *[:-]-+[:-] *))\|? *$/);
  if (!secondLineMatch) { return false; }

  rows = secondLineMatch[1].split('|');
  aligns = [];
  for (i = 0; i < rows.length; i++) {
    t = rows[i].trim();
    if (t[t.length - 1] === ':') {
      aligns[i] = t[0] === ':' ? 'center' : 'right';
    } else if (t[0] === ':') {
      aligns[i] = 'left';
    } else {
      aligns[i] = '';
    }
  }

  firstLineMatch = lineMatch(state, startLine, /^ *\|?(.*?\|.*?)\|? *$/);
  if (!firstLineMatch) { return false; }

  rows = firstLineMatch[1].split('|');
  if (aligns.length !== rows.length) { return false; }
  if (silent) { return true; }

  state.tokens.push({ type: 'table_open' });
  state.tokens.push({ type: 'tr_open' });

  for (i = 0; i < rows.length; i++) {
    state.tokens.push({ type: 'th_open', align: aligns[i] });
    subState = state.clone(rows[i].trim());
    state.lexerInline.tokenize(subState, subState.src);
    state.tokens.push({ type: 'th_close' });
  }
  state.tokens.push({ type: 'tr_close' });

  for (nextLine = startLine + 2; nextLine < endLine; nextLine++) {
    m = lineMatch(state, nextLine, /^ *\|?(.*?\|.*?)\|? *$/);
    if (!m) { break; }
    rows = m[1].split('|');

    state.tokens.push({ type: 'tr_open' });
    for (i = 0; i < rows.length; i++) {
      state.tokens.push({ type: 'td_open', align: aligns[i] });
      subState = state.clone(rows[i].replace(/^\|? *| *\|?$/g, ''));
      state.lexerInline.tokenize(subState, subState.src);
      state.tokens.push({ type: 'td_close' });
    }
    state.tokens.push({ type: 'tr_close' });
  }
  state.tokens.push({ type: 'table_close' });

  state.line = nextLine;
  return true;
};
