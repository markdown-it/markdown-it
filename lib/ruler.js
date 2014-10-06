// Ruler is helper class to build responsibility chains from parse rules.
// It allows:
//
// - easy stack rules chains
// - getting main chain and named chains content (as arrays of functions)

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
  var index;

  if (isFunction(name)) {
    altNames = fn;
    fn = name;
    name = '';
  }

  if (!name) {
    this.rules.unshift({
      name: functionName(fn),
      fn: fn,
      alt: altNames || []
    });

  } else {

    index = this.find(name);
    if (index === -1) {
      throw new Error('Parser rule not found: ' + name);
    }
    this.rules.splice(index, 0, fn);
  }

  this.compile();
};


// Add function to parser chain after one with given name.
// Or add to end, if name not defined
//
Ruler.prototype.after = function (name, fn, altNames) {
  var index;

  if (isFunction(name)) {
    altNames = fn;
    fn = name;
    name = '';
  }

  if (!name) {
    this.rules.push({
      name: functionName(fn),
      fn: fn,
      alt: altNames || []
    });

  } else {

    index = this.find(name);
    if (index === -1) {
      throw new Error('Parser rule not found: ' + name);
    }
    this.rules.splice(index + 1, 0, fn);
  }

  this.compile();
};


// Get rules list as array of functions. By default returns main chain
//
Ruler.prototype.getRules = function (chainName) {
  var result = [];

  if (!chainName) {
    this.rules.forEach(function (rule) {
      result.push(rule.fn);
    });
    return result;
  }

  this.rules.forEach(function (rule) {
    if (rule.alt.indexOf(chainName) >= 0) {
      result.push(rule.fn);
    }
  });
  return result;
};


module.exports = Ruler;
