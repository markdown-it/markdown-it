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
