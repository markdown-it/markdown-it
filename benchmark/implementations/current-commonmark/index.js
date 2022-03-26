'use strict';

let md = require('../../../')('commonmark');

// Replace normalizers to more primitive, for more "honest" compare.
// Default ones can cause 1.5x slowdown.
let encode = md.utils.lib.mdurl.encode;

md.normalizeLink     = function (url) { return encode(url); };
md.normalizeLinkText = function (str) { return str; };

exports.run = function (data) {
  return md.render(data);
};
