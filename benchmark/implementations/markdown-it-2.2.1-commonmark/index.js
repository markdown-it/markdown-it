'use strict';

var md = require('markdown-it')('commonmark');

exports.run = function (data) {
  return md.render(data);
};
