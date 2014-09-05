'use strict';


var Renderer = require('./lib/renderer');
var LexerBlock = require('./lib/lexer_block');
var LexerInline = require('./lib/lexer_inline');


// Parser state class
//
function State(src, lexerBlock, lexerInline, renderer, options) {
  var ch, s, start, pos, len, indent, indent_found;

  // TODO: Temporary solution. Check if more effective possible,
  // withous str change
  //
  // - replace tabs with spaces
  // - remove `\r` to simplify newlines check (???)

  this.src = src
              .replace(/\t/g, '    ')
              .replace(/\r/g, '')
              .replace(/\u00a0/g, ' ')
              .replace(/\u2424/g, '\n');

  // Shortcuts to simplify nested calls
  this.lexerBlock  = lexerBlock;
  this.lexerInline = lexerInline;
  this.renderer    = renderer;

  // TODO: (?) set directly for faster access.
  this.options = options;

  //
  // Internal state vartiables
  //

  this.tokens = [];

  this.bMarks = []; // line begin offsets for fast jumps
  this.eMarks = []; // line end offsets for fast jumps
  this.tShift = []; // indent for each line

  // Generate markers.
  s = this.src;
  indent = 0;
  indent_found = false;

  for(start = pos = indent = 0, len = s.length; pos < len; pos++) {
    ch = s.charCodeAt(pos);

    // TODO: check other spaces and tabs too or keep existing regexp replace ??
    if (!indent_found && ch === 0x20/* space */) {
      indent++;
    }
    if (!indent_found && ch !== 0x20/* space */) {
      this.tShift.push(indent);
      indent_found = true;
    }


    if (ch === 0x0D || ch === 0x0A) {
      this.bMarks.push(start);
      this.eMarks.push(pos);
      indent_found = false;
      indent = 0;
      start = pos + 1;
    }
    if (ch === 0x0D && pos < len && s.charCodeAt(pos) === 0x0A) {
      pos++;
      start++;
    }
  }
  if (ch !== 0x0D || ch !== 0x0A) {
    this.bMarks.push(start);
    this.eMarks.push(len);
    this.tShift.push(indent);
  }

  // inline lexer variables
  this.pos        = 0; // char index in src

  // block lexer variables
  this.blkLevel   = 0;
  this.blkIndent  = 0;
  this.line       = 0; // line index in src
  this.lineMax = this.bMarks.length;

  // renderer
  this.result = '';
}


// Main class
//
function Remarkable(options) {
  this.options = {};
  this.state = null;

  this.lexerInline  = new LexerInline();
  this.lexerBlock   = new LexerBlock();
  this.renderer     = new Renderer();

  if (options) { this.set(options); }
}


Remarkable.prototype.set = function (options) {
  Object.keys(options).forEach(function (key) {
    this.options[key] = options[key];
  }, this);
};


Remarkable.prototype.render = function (src) {

  if (!src) { return ''; }

  var state = new State(
    src,
    this.lexerBlock,
    this.lexerInline,
    this.renderer,
    this.options
  );

  // TODO: skip leading empty lines

  state.lexerBlock.tokenize(state, state.line, state.lineMax);

  // TODO: ??? eat empty paragraphs from tail

  //console.log(state.tokens)

  return this.renderer.render(state);
};


module.exports = Remarkable;
