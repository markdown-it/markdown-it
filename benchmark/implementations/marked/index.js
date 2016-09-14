'use strict';

var marked = require('../../extra/lib/node_modules/marked');

exports.run = function (data) {
  return marked(data);
};
