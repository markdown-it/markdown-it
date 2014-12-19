'use strict'

var md = require('../../../')('commonmark');

exports.run = function(data) {
  return md.render(data);
}
