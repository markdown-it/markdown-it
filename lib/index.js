// Main perser class

'use strict';


var assign       = require('./common/utils').assign;
var Renderer     = require('./renderer');
var ParserBlock  = require('./parser_block');
var ParserInline = require('./parser_inline');
var Typographer  = require('./typographer');


var defaults     = require('./defaults/remarkable');
var cmmDefaults  = require('./defaults/commonmark');
var cmmRules     = require('./defaults/commonmark_rules');


// Main class
//
function Remarkable(options) {
  this.options  = assign({}, defaults);
  this.state    = null;

  this.inline   = new ParserInline();
  this.block    = new ParserBlock();
  this.renderer = new Renderer();
  this.typographer = new Typographer();
  this.linkifier   = new Typographer();

  // Linkifier is a separate typographer, for convenience.
  // Configure it here.
  this.linkifier.ruler.enable([], true);
  this.linkifier.ruler.after(require('./rules_typographer/linkify'));

  // Cross-references to simplify code (a bit dirty, but easy).
  this.block.inline       = this.inline;
  this.inline.typographer = this.typographer;
  this.inline.linkifier   = this.linkifier;

  if (options) { this.set(options); }
}


// Set options, if you did not passed those to constructor
//
Remarkable.prototype.set = function (options) {
  if (String(options).toLowerCase() === 'commonmark') {
    assign(this.options, cmmDefaults);
    this.inline.ruler.enable(cmmRules.inline, true);
    this.block.ruler.enable(cmmRules.block, true);
  } else {
    assign(this.options, options);
  }
};


// Sugar for curried plugins init:
//
// var md = new Remarkable();
//
// md.use(plugin1)
//   .use(plugin2, opts)
//   .use(plugin3);
//
Remarkable.prototype.use = function (plugin, opts) {
  plugin(this, opts);
  return this;
};


// Main method that does all magic :)
//
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
