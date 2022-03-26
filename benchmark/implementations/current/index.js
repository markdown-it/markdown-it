'use strict';

let md = require('../../../')({
  html: true,
  linkify: true,
  typographer: true
});

exports.run = function (data) {
  return md.render(data);
};
