'use strict';

let marked = require('../../extra/lib/node_modules/marked');

exports.run = function (data) {
  return marked(data);
};
