'use strict';

const markdownit = require('../');

exports.render = (str) => {
  return markdownit().render(str);
};
