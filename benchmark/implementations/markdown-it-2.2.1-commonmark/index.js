'use strict';

var md = require('./src')('commonmark');

exports.run = function(data) {
  return md.render(data);
};
