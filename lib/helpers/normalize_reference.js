'use strict';


// Hepler to [reference labels]. No better place for this code :)
// It's only for refs/links and should not be exported anywhere.
module.exports = function normalizeReference(str) {
  // use .toUpperCase() instead of .toLowerCase()
  // here to avoid a conflict with Object.prototype
  // members (most notably, `__proto__`)
  return str.trim().replace(/\s+/g, ' ').toUpperCase();
};
