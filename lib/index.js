// Main perser class

'use strict';


var assign       = require('./common/utils').assign;
var isString     = require('./common/utils').isString;
var Renderer     = require('./renderer');
var ParserBlock  = require('./parser_block');
var ParserInline = require('./parser_inline');
var Typographer  = require('./typographer');
var Linkifier    = require('./linkifier');


var config = {
  'default': require('./configs/default'),
  full: require('./configs/full'),
  commonmark: require('./configs/commonmark')
};


// Main class
//
function Remarkable(presetName, options) {
  if (!options) {
    if (!isString(presetName)) {
      options = presetName || {};
      presetName = 'default';
    }
  }

  this.options  = {};
  this.state    = null;

  this.inline   = new ParserInline();
  this.block    = new ParserBlock();
  this.renderer = new Renderer();
  this.typographer = new Typographer();
  this.linkifier   = new Linkifier();

  // Cross-references to simplify code (a bit dirty, but easy).
  this.block.inline       = this.inline;
  this.inline.typographer = this.typographer;
  this.inline.linkifier   = this.linkifier;

  this.configure(config[presetName]);

  if (options) { this.set(options); }
}


// Set options, if you did not passed those to constructor
//
Remarkable.prototype.set = function (options) {
  assign(this.options, options);
};


// Batch loader for components rules states & options
//
Remarkable.prototype.configure = function (presets) {
  var self = this;

  if (!presets) { throw new Error('Wrong config name'); }

  if (presets.options) { self.set(presets.options); }

  if (presets.components) {
    Object.keys(presets.components).forEach(function (name) {
      if (presets.components[name].rules) {
        self[name].ruler.enable(presets.components[name].rules, true);
      }
      if (presets.components[name].options) {
        self[name].set(presets.components[name].options);
      }
    });
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


// Parse input string, returns tokens array. Modify `env` with
// definitions data.
//
Remarkable.prototype.parse = function (src, env) {
  var tokens, tok, i, l;
  // Parse blocks
  tokens = this.block.parse(src, this.options, env);

  // Parse inlines
  for (i = 0, l = tokens.length; i < l; i++) {
    tok = tokens[i];
    if (tok.type === 'inline') {
      tok.children = this.inline.parse(tok.content, this.options, env);
    }
  }

  return tokens;
};

// Main method that does all magic :)
//
Remarkable.prototype.render = function (src) {
  var env = { references: {} };

  return this.renderer.render(this.parse(src, env), this.options, env);
};


module.exports = Remarkable;
