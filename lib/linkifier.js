// Class of link replacement rules
//
'use strict';


var assign = require('./common/utils').assign;
var Ruler  = require('./ruler');


var _rules = [
  [ 'linkify', require('./rules_text/linkify') ]
];


function Linkifier() {
  this._rules = [];

  this.options  = {};

  this.ruler = new Ruler(this.rulesUpdate.bind(this));

  for (var i = 0; i < _rules.length; i++) {
    this.ruler.push(_rules[i][0], _rules[i][1]);
  }
}


Linkifier.prototype.rulesUpdate = function () {
  this._rules = this.ruler.getRules();
};


Linkifier.prototype.set = function (options) {
  assign(this.options, options);
};


Linkifier.prototype.process = function (state) {
  var i, l, rules;

  rules = this._rules;

  for (i = 0, l = rules.length; i < l; i++) {
    rules[i](this, state);
  }
};


module.exports = Linkifier;
