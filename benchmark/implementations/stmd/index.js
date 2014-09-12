'use strict'

var stmd = require('./stmd');
var parser = new stmd.DocParser();
var renderer = new stmd.HtmlRenderer();

exports.run = function(data) {
  return renderer.render(parser.parse(data));
}

