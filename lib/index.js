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
  commonmark: require('./configs/commonmark')
};

function configure(self, setupName) {
  var cfg = config[setupName];

  if (!cfg) { throw new Error('Wrong config name'); }

  if (cfg.options) { self.set(cfg.options); }

  if (cfg.components) {
    Object.keys(cfg.components).forEach(function (name) {
      if (cfg.components[name].rules) {
        self[name].ruler.enable(cfg.components[name].rules, true);
      }
      if (cfg.components[name].options) {
        self[name].set(cfg.components[name].options);
      }
    });
  }
}

// Main class
//
function Remarkable(setupName, options) {
  if (!options) {
    if (!isString(setupName)) {
      options = setupName || {};
      setupName = 'default';
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

  configure(this, setupName.toLowerCase());

  if (options) { this.set(options); }
}


// Set options, if you did not passed those to constructor
//
Remarkable.prototype.set = function (options) {
  assign(this.options, options);
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
