'use strict'

var Remarkable = require('../../../');
var md = new Remarkable({
  html: true,
  xhtml: true,
  breaks: false,
  langprefix: 'language-'
});

exports.run = function(data) {
  return md.render(data);
}
