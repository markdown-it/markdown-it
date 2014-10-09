// Class of typographic replacements rules
//
// - single quotes
// - double quotes
// - em-dashes
// - link patterns
// - email patterns
//
'use strict';

// TODO:
// - fractionals 1/2, 1/4, 3/4 -> ½, ¼, ¾
// - miltiplication 2 x 4 -> 2 × 4

var assign   = require('./common/utils').assign;
var defaults = require('./defaults_typographer');
var Ruler    = require('./ruler');


var rules = [];


rules.push(function single(t, state) {
  var i, token, text,
      tokens = state.tokens,
      options = t.options;

  for (i = tokens.length - 1; i >= 0; i--) {
    token = tokens[i];
    if (token.type === 'text') {
      text = token.content;

      if (text.indexOf('(') >= 0) {
        if (options.copyright) {
          text = text.replace(/\(c\)/gi, '©');
        }
        if (options.trademark) {
          text = text.replace(/\(tm\)/gi, '™');
        }
        if (options.registered) {
          text = text.replace(/\(r\)/gi, '®');
        }
        if (options.paragraph) {
          text = text.replace(/\(p\)/gi, '§');
        }
      }

      if (options.plusminus && text.indexOf('+-') >= 0) {
        text = text.replace(/\+-/g, '±');
      }
      if (options.ellipsis && text.indexOf('..') >= 0) {
        // .., ..., ....... -> …
        // but ?..... & !..... -> ?.. & !..
        text = text.replace(/\.{2,}/g, '…').replace(/([?!])…/g, '$1..');
      }
      if (options.dupes &&
          (text.indexOf('????') >= 0 ||
           text.indexOf('!!!!') >= 0 ||
           text.indexOf(',,') >= 0)) {
        text = text.replace(/([?!]){4,}/g, '$1$1$1').replace(/,{2,}/g, ',');
      }
      if (options.emDashes && text.indexOf('--') >= 0) {
        text = text.replace(/(^|\s)--(\s|$)/mg, '$1—$2');
      }

      token.content = text;
    }
  }
});


function Typographer() {
  this.options  = assign({}, defaults);

  this.ruler = new Ruler(this.rulesUpdate.bind(this));

  for (var i = 0; i < rules.length; i++) {
    this.ruler.after(rules[i]);
  }
}


Typographer.prototype.rulesUpdate = function () {
  this._rules = this.ruler.getRules();
};


Typographer.prototype.set = function (options) {
  assign(this.options, options);
};


Typographer.prototype.process = function (state) {
  var i, l, rules;

  if (!state.options.typographer) { return; }

  rules = this._rules;

  for (i = 0, l = rules.length; i < l; i++) {
    rules[i](this, state);
  }
};


module.exports = Typographer;
