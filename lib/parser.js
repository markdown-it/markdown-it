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
  var state;

  if (!src) { return ''; }

  state = new State(
    src,
    this.lexerBlock,
    this.lexerInline,
    this.renderer,
    [],
    this.options
  );

  // TODO: skip leading empty lines

  state.lexerBlock.tokenize(state, state.line, state.lineMax);

  // TODO: ??? eat empty paragraphs from tail

  //console.log(state.tokens)

  return this.renderer.render(state);
};


module.exports = Parser;
