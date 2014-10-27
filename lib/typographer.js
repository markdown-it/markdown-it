// Class of typographic replacement rules
//
'use strict';

// TODO:
// - fractionals 1/2, 1/4, 3/4 -> ½, ¼, ¾
// - miltiplication 2 x 4 -> 2 × 4


var assign   = require('./common/utils').assign;
var Ruler    = require('./ruler');


var _rules = [
  require('./rules_text/replace'),
  require('./rules_text/smartquotes')
];


function Typographer() {
  this._rules = [];

  this.options = {};

  this.ruler = new Ruler(this.rulesUpdate.bind(this));

  for (var i = 0; i < _rules.length; i++) {
    this.ruler.after(_rules[i]);
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

  rules = this._rules;

  for (i = 0, l = rules.length; i < l; i++) {
    rules[i](this, state);
  }
};


module.exports = Typographer;
