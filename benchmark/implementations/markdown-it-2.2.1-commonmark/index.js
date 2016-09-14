'use strict';

var md = require('../../extra/lib/node_modules/markdown-it')('commonmark');

exports.run = function (data) {
  return md.render(data);
};
