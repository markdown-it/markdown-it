// Ruler is helper class to build responsibility chains from parse rules.
// It allows:
//
// - easy stack rules chains
// - getting main chain and named chains content (as arrays of functions)
//
'use strict';


////////////////////////////////////////////////////////////////////////////////

function Ruler(compileFn) {
  this.compile = compileFn; // callback to call after each change

  // List of added rules. Each element is:
  //
  // {
  //   name: XXX,
  //   enabled: Boolean,
  //   fn: Function(),
  //   alt: [ name2, name3 ]
  // }
  //
  this.rules = [];
}


// Find rule index by name
//
Ruler.prototype.find = function (name) {
  for (var i = 0; i < this.rules.length; i++) {
    if (this.rules[i].name === name) {
      return i;
    }
  }
  return -1;
};


// Replace rule function
//
Ruler.prototype.at = function (name, fn, options) {
  var index = this.find(name);
  var opt = options || {};

  if (index === -1) { throw new Error('Parser rule not found: ' + name); }

  this.rules[index].fn = fn;
  this.rules[index].alt = opt.alt || [];
  this.compile();
};


// Add rule to chain before one with given name.
//
Ruler.prototype.before = function (beforeName, ruleName, fn, options) {
  var index = this.find(beforeName);
  var opt = options || {};

  if (index === -1) { throw new Error('Parser rule not found: ' + beforeName); }

  this.rules.splice(index, 0, {
    name: ruleName,
    enabled: true,
    fn: fn,
    alt: opt.alt || []
  });

  this.compile();
};


// Add rule to chain after one with given name.
//
Ruler.prototype.after = function (afterName, ruleName, fn, options) {
  var index = this.find(afterName);
  var opt = options || {};

  if (index === -1) { throw new Error('Parser rule not found: ' + afterName); }

  this.rules.splice(index + 1, 0, {
    name: ruleName,
    enabled: true,
    fn: fn,
    alt: opt.alt || []
  });

  this.compile();
};

// Add rule to the end of chain.
//
Ruler.prototype.push = function (ruleName, fn, options) {
  var opt = options || {};

  this.rules.push({
    name: ruleName,
    enabled: true,
    fn: fn,
    alt: opt.alt || []
  });

  this.compile();
};


// Get rules list as array of functions. By default returns main chain
//
Ruler.prototype.getRules = function (chainName) {
  var result = [];

  if (!chainName) {
    this.rules.forEach(function (rule) {
      if (rule.enabled) {
        result.push(rule.fn);
      }
    });
    return result;
  }

  this.rules.forEach(function (rule) {
    if (rule.alt.indexOf(chainName) >= 0 && rule.enabled) {
      result.push(rule.fn);
    }
  });
  return result;
};


// Enable list of rules by names. If `strict` is true, then all non listed
// rules will be disabled.
//
Ruler.prototype.enable = function (list, strict) {
  if (!Array.isArray(list)) {
    list = [ list ];
  }

  // In strict mode disable all existing rules first
  if (strict) {
    this.rules.forEach(function (rule) {
      rule.enabled = false;
    });
  }

  // Search by name and enable
  list.forEach(function (name) {
    var idx = this.find(name);

    if (idx < 0) { throw new Error('Rules manager: invalid rule name ' + name); }
    this.rules[idx].enabled = true;

  }, this);

  this.compile();
};


// Disable list of rules by names.
//
Ruler.prototype.disable = function (list) {
  if (!Array.isArray(list)) {
    list = [ list ];
  }

  // Search by name and disable
  list.forEach(function (name) {
    var idx = this.find(name);

    if (idx < 0) { throw new Error('Rules manager: invalid rule name ' + name); }
    this.rules[idx].enabled = false;

  }, this);

  this.compile();
};


module.exports = Ruler;
