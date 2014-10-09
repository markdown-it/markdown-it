'use strict'

var Remarkable = require('../../../');
var md = new Remarkable('commonmark' /*{
  html: true,
  xhtml: true,
  breaks: false,
  langPrefix: 'language-'
}*/);

exports.run = function(data) {
  return md.render(data);
}
