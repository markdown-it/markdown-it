// Main perser class

'use strict';


var utils        = require('./common/utils');
var assign       = require('./common/utils').assign;
var isString     = require('./common/utils').isString;
var Renderer     = require('./renderer');
var ParserCore   = require('./parser_core');
var ParserBlock  = require('./parser_block');
var ParserInline = require('./parser_inline');
var Ruler        = require('./ruler');

var config = {
  'default': require('./presets/default'),
  full: require('./presets/full'),
  commonmark: require('./presets/commonmark')
};


function StateCore(self, src, env) {
  this.src = src;
  this.env = env;
  this.options = self.options;
  this.tokens = [];
  this.inlineMode = false;

  this.inline = self.inline;
  this.block = self.block;
  this.renderer = self.renderer;
  this.typographer = self.typographer;
}

// Main class
//
function MarkdownIt(presetName, options) {
  if (!(this instanceof MarkdownIt)) {
    return new MarkdownIt(presetName, options);
  }

  if (!options) {
    if (!isString(presetName)) {
      options = presetName || {};
      presetName = 'default';
    }
  }

  this.inline   = new ParserInline();
  this.block    = new ParserBlock();
  this.core     = new ParserCore();
  this.renderer = new Renderer();
  this.ruler    = new Ruler();

  // Expose utils for easy acces from plugins
  this.utils    = utils;

  this.options  = {};
  this.configure(config[presetName]);

  if (options) { this.set(options); }
}


// Set options, if you did not passed those to constructor
//
MarkdownIt.prototype.set = function (options) {
  assign(this.options, options);
};


// Batch loader for components rules states & options
//
MarkdownIt.prototype.configure = function (presets) {
  var self = this;

  if (!presets) { throw new Error('Wrong `markdown-it` preset, check name/content'); }

  if (presets.options) { self.set(presets.options); }

  if (presets.components) {
    Object.keys(presets.components).forEach(function (name) {
      if (presets.components[name].rules) {
        self[name].ruler.enableOnly(presets.components[name].rules);
      }
    });
  }
};


// Sugar to enable rules by names in all chains at once
//
MarkdownIt.prototype.enable = function (list) {
  [ 'core', 'block', 'inline' ].forEach(function (chain) {
    this[chain].ruler.enable(list, true);
  }, this);
};


// Sugar to disable rules by names in all chains at once
//
MarkdownIt.prototype.disable = function (list) {
  [ 'core', 'block', 'inline' ].forEach(function (chain) {
    this[chain].ruler.disable(list, true);
  }, this);
};


// Sugar for curried plugins init:
//
// var md = new MarkdownIt();
//
// md.use(plugin1)
//   .use(plugin2, opts)
//   .use(plugin3);
//
MarkdownIt.prototype.use = function (plugin, opts) {
  plugin(this, opts);
  return this;
};


// Parse input string, returns tokens array. Modify `env` with
// definitions data.
//
MarkdownIt.prototype.parse = function (src, env) {
  var state = new StateCore(this, src, env);

  this.core.process(state);

  return state.tokens;
};


// Main method that does all magic :)
//
MarkdownIt.prototype.render = function (src, env) {
  env = env || {};

  return this.renderer.render(this.parse(src, env), this.options, env);
};


// Parse content as single string
//
MarkdownIt.prototype.parseInline = function (src, env) {
  var state = new StateCore(this, src, env);

  state.inlineMode = true;
  this.core.process(state);

  return state.tokens;
};


// Render single string, without wrapping it to paragraphs
//
MarkdownIt.prototype.renderInline = function (src, env) {
  env = env || {};

  return this.renderer.render(this.parseInline(src, env), this.options, env);
};


module.exports = MarkdownIt;

// Expose helpers, useful for custom renderer functions
module.exports.utils = require('./common/utils');
