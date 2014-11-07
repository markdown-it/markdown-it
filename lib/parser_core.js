// Class of top level (`core`)  rules
//
'use strict';


var Ruler  = require('./ruler');


var _rules = [
  [ 'block',        require('./rules_core/block')        ],
  [ 'abbr',         require('./rules_core/abbr')         ],
  [ 'references',   require('./rules_core/references')   ],
  [ 'inline',       require('./rules_core/inline')       ],
  [ 'abbr2',        require('./rules_core/abbr2')        ],
  [ 'replacements', require('./rules_core/replacements') ],
  [ 'smartquotes',  require('./rules_core/smartquotes')  ],
  [ 'linkify',      require('./rules_core/linkify')      ]
];


function Core() {
  this.options = {};

  this.ruler = new Ruler();

  for (var i = 0; i < _rules.length; i++) {
    this.ruler.push(_rules[i][0], _rules[i][1]);
  }
}


Core.prototype.process = function (state) {
  var i, l, rules;

  rules = this.ruler.getRules('');

  for (i = 0, l = rules.length; i < l; i++) {
    rules[i](state);
  }
};


module.exports = Core;
