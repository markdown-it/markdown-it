// Main perser class

'use strict';


var assign = require('object-assign');


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
  var tokens, tok, i, l;

  // Parse blocks
  tokens = this.lexerBlock.parse(src, this.options);

  // Parse inlines
  for (i = 0, l = tokens.length; i < l; i++) {
    tok = tokens[i];
    if (tok.type === 'inline') {
      tok.children = this.lexerInline.parse(tok.content, this.options);
    }
  }

  // Render
  return this.renderer.render(tokens, this.options);
};


module.exports = Parser;
