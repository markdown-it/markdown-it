'use strict';

var marked = require('../../../node_modules/marked');

exports.run = function (data) {
  return marked(data);
};
