// GFM table, non-standard

'use strict';


function getLine(state, line) {
  var pos = state.bMarks[line] + state.blkIndent,
      max = state.eMarks[line];

  return state.src.substr(pos, max - pos);
}

function escapedSplit(str) {
  var result = [],
      pos = 0,
      max = str.length,
      ch,
      escapes = 0,
      lastPos = 0,
      backTicked = false,
      lastBackTick = 0;

  ch  = str.charCodeAt(pos);

  while (pos < max) {
    if (ch === 0x60/* ` */ && (escapes % 2 === 0)) {
      backTicked = !backTicked;
      lastBackTick = pos;
    } else if (ch === 0x7c/* | */ && (escapes % 2 === 0) && !backTicked) {
      result.push(str.substring(lastPos, pos));
      lastPos = pos + 1;
    } else if (ch === 0x5c/* \ */) {
      escapes++;
    } else {
      escapes = 0;
    }

    pos++;

    // If there was an un-closed backtick, go back to just after
    // the last backtick, but as if it was a normal character
    if (pos === max && backTicked) {
      backTicked = false;
      pos = lastBackTick + 1;
    }

    ch = str.charCodeAt(pos);
  }

  result.push(str.substring(lastPos));

  return result;
}


module.exports = function table(state, startLine, endLine, silent) {
  var ch, lineText, pos, i, nextLine, columns, columnCount, token,
      aligns, t, tableLines, tbodyLines, columnVIndex;

  // should have at least three lines
  if (startLine + 2 > endLine) { return false; }

  nextLine = startLine + 1;

  if (state.sCount[nextLine] < state.blkIndent) { return false; }

  // first character of the second line should be '|' or '-'

  pos = state.bMarks[nextLine] + state.tShift[nextLine];
  if (pos >= state.eMarks[nextLine]) { return false; }

  ch = state.src.charCodeAt(pos);
  if (ch !== 0x7C/* | */ && ch !== 0x2D/* - */ && ch !== 0x3A/* : */) { return false; }

  lineText = getLine(state, startLine + 1);
  if (!/^[-:| ]+$/.test(lineText)) { return false; }

  columns = lineText.split('|');
  aligns = [];
  for (i = 0; i < columns.length; i++) {
    t = columns[i].trim();
    if (!t) {
      // allow empty columns before and after table, but not in between columns;
      // e.g. allow ` |---| `, disallow ` ---||--- `
      if (i === 0 || i === columns.length - 1) {
        continue;
      } else {
        return false;
      }
    }

    if (!/^:?-+:?$/.test(t)) { return false; }
    if (t.charCodeAt(t.length - 1) === 0x3A/* : */) {
      aligns.push(t.charCodeAt(0) === 0x3A/* : */ ? 'center' : 'right');
    } else if (t.charCodeAt(0) === 0x3A/* : */) {
      aligns.push('left');
    } else {
      aligns.push('');
    }
  }

  lineText = getLine(state, startLine).trim();
  if (lineText.indexOf('|') === -1) { return false; }
  columns = escapedSplit(lineText.replace(/^\||\|$/g, ''));

  // header row will define an amount of columns in the entire table,
  // and align row shouldn't be smaller than that (the rest of the rows can)
  columnCount = columns.length;
  if (columnCount > aligns.length) { return false; }

  if (silent) { return true; }

  token          = state.push('table_open', 'table', 1);
  token.map      = tableLines = [ startLine, 0 ];
  token.size     = 0;
  token.position = state.bMarks[startLine];


  token          = state.push('thead_open', 'thead', 1);
  token.map      = [ startLine, startLine + 1 ];
  token.size     = 0;
  token.position = state.bMarks[startLine];

  token          = state.push('tr_open', 'tr', 1);
  token.map      = [ startLine, startLine + 1 ];
  token.size     = 0;
  token.position = state.bMarks[startLine];

  columnVIndex = state.bMarks[startLine] + state.tShift[startLine];
  for (i = 0; i < columns.length; i++) {
    token          = state.push('th_open', 'th', 1);
    token.map      = [ startLine, startLine + 1 ];
    token.size     = 1;
    token.position = columnVIndex;
    columnVIndex = columnVIndex + 1;

    if (aligns[i]) {
      token.attrs  = [ [ 'style', 'text-align:' + aligns[i] ] ];
    }

    token          = state.push('inline', '', 0);
    token.content  = columns[i].trim();
    token.map      = [ startLine, startLine + 1 ];
    token.children = [];
    token.position = columnVIndex;
    token.size     = columns[i].length;
    columnVIndex = columnVIndex + columns[i].length;

    token          = state.push('th_close', 'th', -1);
    token.position = columnVIndex;

    // Last column?
    if (i === (columns.length - 1)) {
      token.size     = 1;
      columnVIndex = columnVIndex + 1;
    }

  }

  token          = state.push('tr_close', 'tr', -1);
  token.size     = 0;
  token.position = state.eMarks[startLine];

  token          = state.push('thead_close', 'thead', -1);
  token.size     = state.eMarks[startLine + 1] - state.bMarks[startLine + 1];
  token.position = state.bMarks[startLine + 1];

  token     = state.push('tbody_open', 'tbody', 1);
  token.map = tbodyLines = [ startLine + 2, 0 ];
  token.size     = 0;
  token.position = state.bMarks[startLine + 2];

  for (nextLine = startLine + 2; nextLine < endLine; nextLine++) {
    if (state.sCount[nextLine] < state.blkIndent) { break; }

    lineText = getLine(state, nextLine).trim();
    if (lineText.indexOf('|') === -1) { break; }
    columns = escapedSplit(lineText.replace(/^\||\|$/g, ''));

    token = state.push('tr_open', 'tr', 1);
    token.size     = 0;
    token.position = state.bMarks[nextLine];

    columnVIndex = state.bMarks[nextLine] + state.tShift[nextLine];
    for (i = 0; i < columnCount; i++) {
      token          = state.push('td_open', 'td', 1);
      token.size     = 1;
      token.position = columnVIndex;
      columnVIndex++;

      if (aligns[i]) {
        token.attrs  = [ [ 'style', 'text-align:' + aligns[i] ] ];
      }

      token          = state.push('inline', '', 0);
      token.content  = columns[i] ? columns[i].trim() : '';
      token.children = [];
      token.size     = (columns[i] || '').length;
      token.position = columnVIndex;
      columnVIndex += token.size;

      token          = state.push('td_close', 'td', -1);
      token.position = columnVIndex;

      // Last column?
      if (i === (columns.length - 1)) {
        token.size     = 1;
      }
    }
    token = state.push('tr_close', 'tr', -1);
    token.size     = 0;
    token.position = state.eMarks[nextLine];
  }

  token = state.push('tbody_close', 'tbody', -1);
  token.size     = 0;
  token.position = state.eMarks[nextLine];

  token = state.push('table_close', 'table', -1);
  token.size     = 0;
  token.position = state.eMarks[nextLine];

  tableLines[1] = tbodyLines[1] = nextLine;
  state.line = nextLine;
  return true;
};
