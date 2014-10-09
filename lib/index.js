// Main perser class

'use strict';


var assign       = require('./common/utils').assign;
var Renderer     = require('./renderer');
var ParserBlock  = require('./parser_block');
var ParserInline = require('./parser_inline');
var Typographer  = require('./typographer');
var defaults     = require('./defaults');

// Main class
//
function Remarkable(options) {
  this.options  = assign({}, defaults);
  this.state    = null;

  this.inline   = new ParserInline();
  this.block    = new ParserBlock();
  this.renderer = new Renderer();
  this.typographer = new Typographer();

  // Cross-references to simplify code (a bit dirty, but easy).
  this.block.inline = this.inline;
  this.inline.typographer = this.typographer;

  if (options) { this.set(options); }
}


Remarkable.prototype.set = function (options) {
  assign(this.options, options);
};


Remarkable.prototype.render = function (src) {
  var tokens, tok, i, l, env = { references: Object.create(null) };

  // Parse blocks
  tokens = this.block.parse(src, this.options, env);

  // Parse inlines
  for (i = 0, l = tokens.length; i < l; i++) {
    tok = tokens[i];
    if (tok.type === 'inline') {
      tok.children = this.inline.parse(tok.content, this.options, env);
    }
  }

  // Render
  return this.renderer.render(tokens, this.options, env);
};


module.exports = Remarkable;
