// Main perser class

'use strict';


var assign = require('object-assign');


var State       = require('./state');
var Renderer    = require('./renderer');
var LexerBlock  = require('./lexer_block');
var LexerInline = require('./lexer_inline');


// Main class
//
function Parser(options) {
  this.options = {};
  this.state = null;

  this.lexerInline  = new LexerInline();
  this.lexerBlock   = new LexerBlock();
  this.renderer     = new Renderer();

  if (options) { this.set(options); }
}


Parser.prototype.set = function (options) {
  assign(this.options, options);
};


Parser.prototype.render = function (src) {
  var state, lineStart = 0, lastTabPos = 0, tokens, i, l, t;

  if (!src) { return ''; }

  if (src.indexOf('\r') >= 0) {
    src = src.replace(/\r/, '');
  }

  if (src.indexOf('\u00a0') >= 0) {
    src = src.replace(/\u00a0/g, ' ');
  }

  if (src.indexOf('\u2424') >= 0) {
    src = src.replace(/\u2424/g, '\n');
  }

  // TODO: benchmark it
  // Replace tabs with proper number of spaces (1..4)
  if (src.indexOf('\t') >= 0) {
    src = src.replace(/[\n\t]/g, function (match, offset) {
      var result;
      if (src.charCodeAt(offset) === 0x0A) {
        lineStart = offset + 1;
        lastTabPos = 0;
        return match;
      }
      result = '    '.slice((offset - lineStart - lastTabPos) % 4);
      lastTabPos = offset - lineStart + 1;
      return result;
    });
  }


  state = new State(
    src,
    this.lexerBlock,
    this.lexerInline,
    this.renderer,
    [],
    this.options
  );

  // Parse blocks
  state.lexerBlock.tokenize(state, state.line, state.lineMax);

  // Parse inlines
  tokens = state.tokens;
  for (i = 0, l = tokens.length; i < l; i++) {
    t = tokens[i];
    if (t.type === 'inline') {
      t.children = state.lexerInline.parse(t.content, state.options);
    }
  }

  // Render
  return this.renderer.render(state.tokens, this.options);
};


module.exports = Parser;
