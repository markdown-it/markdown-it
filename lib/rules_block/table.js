// GFM table, non-standard

'use strict';


function lineMatch(state, line, reg) {
  var pos = state.bMarks[line] + state.blkIndent,
      max = state.eMarks[line];

  return state.src.substr(pos, max - pos).match(reg);
}


module.exports = function table(state, startLine, endLine, silent) {
  var ch, firstLineMatch, secondLineMatch, pos, i, nextLine, m, rows,
      aligns, t, tableLines, tbodyLines;

  // should have at least three lines
  if (startLine + 2 > endLine) { return false; }

  nextLine = startLine + 1;

  if (state.tShift[nextLine] < state.blkIndent) { return false; }

  // first character of the second line should be '|' or '-'

  pos = state.bMarks[nextLine] + state.tShift[nextLine];
  if (pos >= state.eMarks[nextLine]) { return false; }

  ch = state.src.charCodeAt(pos);
  if (ch !== 0x7C/* | */ && ch !== 0x2D/* - */ && ch !== 0x3A/* : */) { return false; }

  secondLineMatch = lineMatch(state, startLine + 1,
    /^ *\|?(( *[:-]-+[:-] *\|)+( *[:-]-+[:-] *))\|? *$/);
  if (!secondLineMatch) { return false; }

  rows = secondLineMatch[1].split('|');
  aligns = [];
  for (i = 0; i < rows.length; i++) {
    t = rows[i].trim();
    if (t.charCodeAt(t.length - 1) === 0x3A/* : */) {
      aligns[i] = t.charCodeAt(0) === 0x3A/* : */ ? 'center' : 'right';
    } else if (t.charCodeAt(0) === 0x3A/* : */) {
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

  state.tokens.push({
    type: 'table_open',
    lines: tableLines = [ startLine, 0 ],
    level: state.level++
  });
  state.tokens.push({
    type: 'thead_open',
    lines: [ startLine, startLine + 1 ],
    level: state.level++
  });

  state.tokens.push({
    type: 'tr_open',
    lines: [ startLine, startLine + 1 ],
    level: state.level++
  });
  for (i = 0; i < rows.length; i++) {
    state.tokens.push({
      type: 'th_open',
      align: aligns[i],
      lines: [ startLine, startLine + 1 ],
      level: state.level++
    });
    state.tokens.push({
      type: 'inline',
      content: rows[i].trim(),
      lines: [ startLine, startLine + 1 ],
      level: state.level,
      children: []
    });
    state.tokens.push({ type: 'th_close', level: --state.level });
  }
  state.tokens.push({ type: 'tr_close', level: --state.level });
  state.tokens.push({ type: 'thead_close', level: --state.level });

  state.tokens.push({
    type: 'tbody_open',
    lines: tbodyLines = [ startLine + 2, 0 ],
    level: state.level++
  });

  for (nextLine = startLine + 2; nextLine < endLine; nextLine++) {
    if (state.tShift[nextLine] < state.blkIndent) { break; }

    m = lineMatch(state, nextLine, /^ *\|?(.*?\|.*?)\|? *$/);
    if (!m) { break; }
    rows = m[1].split('|');

    state.tokens.push({ type: 'tr_open', level: state.level++ });
    for (i = 0; i < rows.length; i++) {
      state.tokens.push({ type: 'td_open', align: aligns[i], level: state.level++ });
      state.tokens.push({
        type: 'inline',
        content: rows[i].replace(/^\|? *| *\|?$/g, ''),
        level: state.level,
        children: []
      });
      state.tokens.push({ type: 'td_close', level: --state.level });
    }
    state.tokens.push({ type: 'tr_close', level: --state.level });
  }
  state.tokens.push({ type: 'tbody_close', level: --state.level });
  state.tokens.push({ type: 'table_close', level: --state.level });

  tableLines[1] = tbodyLines[1] = nextLine;
  state.line = nextLine;
  return true;
};
