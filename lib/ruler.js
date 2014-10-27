// Ruler is helper class to build responsibility chains from parse rules.
// It allows:
//
// - easy stack rules chains
// - getting main chain and named chains content (as arrays of functions)
//
'use strict';


////////////////////////////////////////////////////////////////////////////////
// helpers

function _class(obj) { return Object.prototype.toString.call(obj); }
function isFunction(obj) { return _class(obj) === '[object Function]'; }

function functionName(fn) {
  var ret = fn.toString();
  ret = ret.substr('function '.length);
  ret = ret.substr(0, ret.indexOf('('));
  return ret;
}


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


// Replace/delete parser function
//
Ruler.prototype.at = function (name, fn, altNames) {
  var index = this.find(name);

  if (index === -1) {
    throw new Error('Parser rule not found: ' + name);
  }

  if (isFunction(fn)) {
    this.rules[index].fn = fn;
    if (altNames) {
      this.rules[index].alt = altNames;
    }
  } else {
    this.rules = this.rules.slice(0, index).concat(this.rules.slice(index + 1));
  }

  this.compile();
};


// Add function to parser chain before one with given name.
// Or add to start, if name not defined
//
Ruler.prototype.before = function (name, fn, altNames) {
  var index, rule;

  if (isFunction(name)) {
    altNames = fn;
    fn = name;
    name = '';
  }

  rule = {
    name: functionName(fn),
    enabled: true,
    fn: fn,
    alt: altNames || []
  };

  if (!name) {
    this.rules.unshift(rule);
  } else {
    index = this.find(name);
    if (index === -1) {
      throw new Error('Parser rule not found: ' + name);
    }
    this.rules.splice(index, 0, rule);
  }

  this.compile();
};


// Add function to parser chain after one with given name.
// Or add to end, if name not defined
//
Ruler.prototype.after = function (name, fn, altNames) {
  var index, rule;

  if (isFunction(name)) {
    altNames = fn;
    fn = name;
    name = '';
  }

  rule = {
    name: functionName(fn),
    enabled: true,
    fn: fn,
    alt: altNames || []
  };

  if (!name) {
    this.rules.push(rule);
  } else {
    index = this.find(name);
    if (index === -1) {
      throw new Error('Parser rule not found: ' + name);
    }
    this.rules.splice(index + 1, 0, rule);
  }

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
