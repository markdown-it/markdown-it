// Parser state class

'use strict';


function State(src, parser, tokens, options, env) {
  var ch, s, start, pos, len, indent, indent_found;

  // Prepare string to parse:
  //
  // - replace tabs with spaces
  // - remove `\r` to simplify newlines check (???)

  this.src = src;

  // Shortcuts to simplify nested calls
  this.parser = parser;

  this.options = options;

  this.env = env;

  //
  // Internal state vartiables
  //

  this.tokens = tokens;

  this.bMarks = [];  // line begin offsets for fast jumps
  this.eMarks = [];  // line end offsets for fast jumps
  this.tShift = [];  // indent for each line
  this.bqMarks = []; // lines shifts in blockquotes (calculated on bq enter)

  // block parser variables
  this.blkIndent  = 0;
  this.line       = 0; // line index in src
  this.lineMax    = 0; // lines count
  this.tight      = false; // loose/tight mode for lists
  this.listMode   = false; // if true, block parser stops on two newlines
  this.bqLevel    = 0; // blockquote nesting level

  this.level = 0;

  // renderer
  this.result = '';

  // Create caches
  // Generate markers.
  s = this.src;
  indent = 0;
  indent_found = false;

  for (start = pos = indent = 0, len = s.length; pos < len; pos++) {
    ch = s.charCodeAt(pos);

    if (!indent_found) {
      if (ch === 0x20/* space */) {
        indent++;
        continue;
      } else {
        this.tShift.push(indent);
        indent_found = true;
      }
    }

    if (ch === 0x0A || ch === 0x0D) {
      this.bMarks.push(start);
      this.eMarks.push(pos);
      indent_found = false;
      indent = 0;
      start = pos + 1;

      if (ch === 0x0D && pos + 1 < len && s.charCodeAt(pos + 1) === 0x0A) {
        pos++;
        start++;
      }
    }
  }
  if (ch !== 0x0D || ch !== 0x0A) {
    this.bMarks.push(start);
    this.eMarks.push(len);
    if (!indent_found) { this.tShift.push(indent); }
  }

  // Push fake entry to simplify cache bounds checks
  this.bMarks.push(s.length);
  this.eMarks.push(s.length);
  this.tShift.push(0);

  this.lineMax = this.bMarks.length - 1; // don't count last fake line

  for (start = this.bMarks.length; start > 0; start--) {
    this.bqMarks.push(0);
  }
}

State.prototype.isEmpty = function isEmpty(line) {
  return this.bMarks[line] + this.tShift[line] >= this.eMarks[line];
};

State.prototype.skipEmptyLines = function skipEmptyLines(from) {
  for (var max = this.lineMax; from < max; from++) {
    if (this.bMarks[from] + this.tShift[from] < this.eMarks[from]) {
      break;
    }
  }
  return from;
};

// Skip spaces from given position.
State.prototype.skipSpaces = function skipSpaces(pos) {
  for (var max = this.src.length; pos < max; pos++) {
    if (this.src.charCodeAt(pos) !== 0x20/* space */) { break; }
  }
  return pos;
};

// Skip char codes from given position
State.prototype.skipChars = function skipChars(pos, code) {
  for (var max = this.src.length; pos < max; pos++) {
    if (this.src.charCodeAt(pos) !== code) { break; }
  }
  return pos;
};

// Skip char codes reverse from given position - 1
State.prototype.skipCharsBack = function skipCharsBack(pos, code, min) {
  if (pos <= min) { return pos; }

  while (pos > min) {
    if (code !== this.src.charCodeAt(--pos)) { return pos + 1; }
  }
  return pos;
};

// cut lines range from source.
State.prototype.getLines = function getLines(begin, end, indent, keepLastLF) {
  var i, first, last, queue,
      line = begin;

  if (begin >= end) {
    return '';
  }

  // Opt: don't use push queue for single line;
  if (line + 1 === end) {
    first = this.bMarks[line] + Math.min(this.tShift[line], indent);
    last = keepLastLF ? this.bMarks[end] : this.eMarks[end - 1];
    return this.src.slice(first, last);
  }

  queue = new Array(end - begin);

  for (i = 0; line < end; line++, i++) {
    first = this.bMarks[line] + Math.min(this.tShift[line], indent);

    if (line + 1 < end || keepLastLF) {
      // No need for bounds check because we have fake entry on tail.
      last = this.eMarks[line] + 1;
    } else {
      last = this.eMarks[line];
    }

    queue[i] = this.src.slice(first, last);
  }

  return queue.join('');
};

// Create shadow clone of curent state with new input data
State.prototype.clone = function clone(src) {
  return new State(
    src,
    this.parser,
    this.tokens,
    this.options
  );
};

module.exports = State;
