'use strict';

var md = require('../../../node_modules/markdown-it')('commonmark');

exports.run = function (data) {
  return md.render(data);
};
