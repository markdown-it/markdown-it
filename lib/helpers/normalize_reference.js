'use strict';

module.exports = function normalizeReference(str) {
  return str.trim().replace(/\s+/g, ' ').toLowerCase();
};
