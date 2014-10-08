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

var Ruler       = require('./ruler');


var rules = [];


rules.push(function single(t, state) {
  var i, token, text, tokens = state.tokens,
      copyright    = t.copyright,
      trademark    = t.trademark,
      registered   = t.registered,
      plusminus    = t.plusminus;

  for (i = state.tokens.length - 1; i >= 0; i--) {
    if (tokens[i].type === 'text') {
      token = tokens[i];
      text = token.content;

      if (copyright && text.indexOf('(') >= 0) {
        text = text.replace(/\(c\)/gi, '©');
      }
      if (trademark && text.indexOf('(') >= 0) {
        text = text.replace(/\(tm\)/gi, '™');
      }
      if (registered && text.indexOf('(') >= 0) {
        text = text.replace(/\(r\)/gi, '®');
      }
      if (plusminus && text.indexOf('+/-') >= 0) {
        text = text.replace(/\+\/\-/g, '±');
      }

      token.content = text;
    }
  }
});


function Typographer() {
  this.singleQuotes = '‘’';
  this.doubleQuotes = '“”'; // «» - russian, „“ - deutch
  this.copyright    = true;
  this.trademark    = true;
  this.registered   = true;
  this.plusminus    = true;

  this.ruler = new Ruler(this.rulesUpdate.bind(this));

  for (var i = 0; i < rules.length; i++) {
    this.ruler.after(rules[i]);
  }
}


Typographer.prototype.rulesUpdate = function () {
  this._rules = this.ruler.getRules();
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
