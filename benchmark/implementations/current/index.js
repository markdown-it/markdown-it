'use strict'

var Remarkable = require('../../../');
var md = new Remarkable({
  html: true,
  linkify: false,
  typographer: true
});

exports.run = function(data) {
  return md.render(data);
}
