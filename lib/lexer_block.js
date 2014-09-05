// Block lexer


'use strict';


////////////////////////////////////////////////////////////////////////////////
// Helpers


// Check if character is white space
function isWhiteSpace(ch) {
  // TODO: check other spaces and tabs
  return ch === 0x20;
}

// Check if line from `pos` is empty or contains spaces only
function isEmpty(state, line) {
  return state.bMarks[line] + state.tShift[line] >= state.eMarks[line];
}

// Return absolute position of char with default indent an given line,
// or -1 if no requested indent
/*function getIndent(state, line, indent) {
  var ch, pos, max;

  if (line >= state.lineMax) { return -1; }

  pos = state.bMarks[line];
  max = state.eMarks[line];

  while (pos < max && indent > 0) {
    ch = state.src.charCodeAt(pos++);
    if (isWhiteSpace(ch)) { indent--; continue; }
    return -1;
  }

  if (indent > 0) { return -1; }

  return pos;
}*/

// Seek first non empty line from given one and return it's number
function skipEmptyLines(state, from) {
  for (var max = state.lineMax; from < max; from++) {
    if (!isEmpty(state, from)) { break; }
  }
  return from;
}

// Skip spaces from given position. Returns new position
function skipSpaces(state, pos) {
  for (var max = state.src.length; pos < max; pos++) {
    if (!isWhiteSpace(state.src.charCodeAt(pos))) { break; }
  }
  return pos;
}

// Skip char codes from given position
function skipChars(state, pos, code) {
  for (var max = state.src.length; pos < max; pos++) {
    if (code !== state.src.charCodeAt(pos)) { break; }
  }
  return pos;
}

// Skip char codes reverse from given position
function skipCharsBack(state, pos, code, min) {
  for (; pos >= min; pos--) {
    if (code !== state.src.charCodeAt(pos)) { break; }
  }
  return pos;
}


////////////////////////////////////////////////////////////////////////////////
// Lexer rules

var rules = [];


// code (4 spaced padded)
rules.push(function code(state, startLine, endLine, silent) {
  var nextLine, last;

  if (state.tShift[startLine] < 4) { return false; }

  last = nextLine = startLine + 1;

  while (nextLine < endLine) {
    if (isEmpty(state, nextLine)) {
      nextLine++;
      if (state.options.pedantic) {
        last = nextLine;
      }
      continue;
    }
    if (state.tShift[nextLine] >= 4) {
      nextLine++;
      last = nextLine;
      continue;
    }
    break;
  }

  if (silent) { return true; }

  state.tokens.push({
    type: 'code',
    startLine: startLine,
    endLine: last
  });

  state.line = nextLine;
  return true;
});


// fences (``` lang, ~~~ lang)
rules.push(function fences(state, startLine, endLine, silent) {
  var marker, len, params, nextLine,
      pos = state.bMarks[startLine] + state.tShift[startLine],
      max = state.eMarks[startLine];

  if (pos + 3 > max) { return false; }

  marker = state.src.charCodeAt(pos);

  if (marker !== 0x7E/* ~ */ && marker !== 0x60 /* ` */) {
    return false;
  }

  // scan marker length
  len = 1;
  while (state.src.charCodeAt(++pos) === marker) {
    len++;
  }

  if (len < 3) { return false; }

  params = state.src.slice(pos, max).trim();

  if (!/\S/.test(params)) { return false; }

  // search end of block
  nextLine = startLine;

  do {
    nextLine++;

    if (nextLine > endLine) { return false; }

    pos = state.bMarks[nextLine] + state.tShift[nextLine];
    max = state.eMarks[nextLine];

    if (pos + 3 > max) { continue; }

    // check markers
    if (state.src.charCodeAt(pos) !== marker &&
        state.src.charCodeAt(pos + 1) !== marker &&
        state.src.charCodeAt(pos + 2) !== marker) {
      continue;
    }

    pos += 3;

    // make sure tail has spaces only
    //pos = pos < max ? skipSpaces(state, pos) : pos;

    // stmd allow any combonation of markers and spaces in tail

    if (pos < max) { continue; }

    // found!
    break;

  } while (true);

  if (silent) { return true; }

  state.tokens.push({
    type: 'fence',
    params: params.split(/\s+/g),
    startLine: startLine + 1,
    endLine: nextLine
  });

  state.line = skipEmptyLines(state, nextLine + 1);
  return true;
});


// heading (#, ##, ...)
rules.push(function heading(state, startLine, endLine, silent) {
  var ch, level,
      pos = state.bMarks[startLine],
      max = state.eMarks[startLine],
      start = pos;

  pos += state.tShift[startLine];

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

  if (level > 6 || (pos < max && !isWhiteSpace(ch))) { return false; }

  // skip spaces before heading text
  pos = pos < max ? skipSpaces(state, pos) : pos;

  // Now pos contains offset of first heared char
  // Let's cut tails like '    ###  ' from the end of string

  max--;
  ch = state.src.charCodeAt(max);

  while (max > start && isWhiteSpace(ch)) {
    ch = state.src.charCodeAt(--max);
  }
  if (ch === 0x23/* # */) {
    while (max > start && ch === 0x23/* # */) {
      ch = state.src.charCodeAt(--max);
    }
    if (isWhiteSpace(ch)) {
      while (max > start && isWhiteSpace(ch)) {
        ch = state.src.charCodeAt(--max);
      }
    } else if (ch === 0x5C/* \ */) {
      max++;
    }
  }
  max++;

  if (silent) { return true; }

  state.tokens.push({ type: 'heading_open', level: level });
  // only if header is not empty
  if (pos < max) {
    state.lexerInline.tokenize(state, pos, max);
  }
  state.tokens.push({ type: 'heading_close', level: level });

  state.line = skipEmptyLines(state, ++startLine);
  return true;
});



// lheading (---, ===)
rules.push(function lheading(state, startLine, endLine, silent) {
  var marker, pos, mem, max,
      next = startLine + 1;

  if (next >= state.lineMax) { return false; }

  // Scan next line
  pos = state.bMarks[next] + state.tShift[next];
  max = state.eMarks[next];

  if (pos + 3 > max) { return false; }

  marker = state.src.charCodeAt(pos);

  if (marker !== 0x2D/* - */ && marker !== 0x3D/* = */) { return false; }

  mem = pos;
  pos = skipChars(state, pos, marker);

  if (pos - mem < 3) { return false; }

  pos = skipSpaces(state, pos);

  if (pos < max) { return false; }

  state.tokens.push({ type: 'heading_open', level: marker === 0x3D/* = */ ? 1 : 2 });
  state.lexerInline.tokenize(state, state.bMarks[startLine], state.eMarks[startLine]);
  state.tokens.push({ type: 'heading_close', level: marker === 0x3D/* = */ ? 1 : 2 });

  state.line = skipEmptyLines(state, ++next);
  return true;
});


// Horizontal rule
rules.push(function hr(state, startLine, endLine, silent) {
  var marker, cnt, ch,
      pos = state.bMarks[startLine],
      max = state.eMarks[startLine];

  // should not have > 3 leading spaces
  if (state.tShift[startLine] > 3) { return false; }

  pos += state.tShift[startLine];

  if (pos > max) { return false; }

  marker = state.src.charCodeAt(pos++);

  // Check hr marker
  if (marker !== 0x2A/* * */ &&
      marker !== 0x2D/* - */ &&
      marker !== 0x5F/* _ */) {
    return false;
  }

  // markers can be mixed with spaces, but there should be at least 3 one

  cnt = 1;
  while (pos < max) {
    ch = state.src.charCodeAt(pos++);
    if (ch !== marker && !isWhiteSpace(ch)) { return false; }
    if (ch === marker) { cnt++; }
  }

  if (cnt < 3) { return false; }

  if (silent) { return true; }

  state.tokens.push({ type: 'hr' });

  state.line = skipEmptyLines(state, ++startLine);
  return true;
});


// Paragraph
rules.push(function paragraph(state, startLine, endLine) {
  var nextLine = startLine + 1,
      rules_named = state.lexerBlock.rules_named;

  // jump line-by-line until empty one or EOF
  while (nextLine < endLine && !isEmpty(state, nextLine)) {
    // Force paragraph termination of next tag found
    if (rules_named.fences(state, nextLine, endLine, true)) { break; }
    if (rules_named.hr(state, nextLine, endLine, true)) { break; }
    if (rules_named.heading(state, nextLine, endLine, true)) { break; }
    if (rules_named.lheading(state, nextLine, endLine, true)) { break; }
    //if (rules_named.blockquote(state, nextLine, endLine, true)) { break; }
    //if (rules_named.tag(state, nextLine, endLine, true)) { break; }
    //if (rules_named.def(state, nextLine, endLine, true)) { break; }
    nextLine++;
  }

  state.tokens.push({ type: 'paragraph_open' });
  state.lexerInline.tokenize(
    state,
    state.bMarks[startLine],
    state.eMarks[nextLine - 1]
  );
  state.tokens.push({ type: 'paragraph_close' });

  state.line = skipEmptyLines(state, nextLine);
  return true;
});


////////////////////////////////////////////////////////////////////////////////
// Lexer class

function functionName(fn) {
  var ret = fn.toString();
  ret = ret.substr('function '.length);
  ret = ret.substr(0, ret.indexOf('('));
  return ret;
}

function findByName(self, name) {
  for (var i = 0; i < self.rules.length; i++) {
    if (functionName(self.rules[i]) === name) {
      return i;
    }
  }
  return -1;
}


// Block Lexer class
//
function LexerBlock() {
  this.rules = [];
  this.rules_named = {};

  for (var i = 0; i < rules.length; i++) {
    this.after(null, rules[i]);
  }
}


// Replace/delete lexer function
//
LexerBlock.prototype.at = function (name, fn) {
  var index = findByName(name);
  if (index === -1) {
    throw new Error('Lexer rule not found: ' + name);
  }

  if (fn) {
    this.rules[index] = fn;
  } else {
    this.rules = this.rules.slice(0, index).concat(this.rules.slice(index + 1));
  }

  this.rules_named[functionName(fn)] = fn;
};


// Add function to lexer chain before one with given name.
// Or add to start, if name not defined
//
LexerBlock.prototype.before = function (name, fn) {
  if (!name) {
    this.rules.unshift(fn);
    this.rules_named[functionName(fn)] = fn;
    return;
  }

  var index = findByName(name);
  if (index === -1) {
    throw new Error('Lexer rule not found: ' + name);
  }

  this.rules.splice(index, 0, fn);
  this.rules_named[functionName(fn)] = fn;
};


// Add function to lexer chain after one with given name.
// Or add to end, if name not defined
//
LexerBlock.prototype.after = function (name, fn) {
  if (!name) {
    this.rules.push(fn);
    this.rules_named[functionName(fn)] = fn;
    return;
  }

  var index = findByName(name);
  if (index === -1) {
    throw new Error('Lexer rule not found: ' + name);
  }

  this.rules.splice(index + 1, 0, fn);
  this.rules_named[functionName(fn)] = fn;
};


// Generate tokens for input range
//
LexerBlock.prototype.tokenize = function (state, startLine, endLine) {
  var ok, i,
      rules = this.rules,
      len = this.rules.length,
      line = startLine;

  while (line < endLine) {

    // Try all possible rules.
    // On success, rule should:
    //
    // - update `state.pos`
    // - update `state.tokens`
    // - return true

    for (i = 0; i < len; i++) {
      ok = rules[i](state, line, endLine, false);
      if (ok) { break; }
    }

    if (ok) {
      line = state.line;
      continue;
    }
  }
};


module.exports = LexerBlock;
