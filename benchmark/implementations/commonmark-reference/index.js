'use strict'

var commonmark = require('./stmd');
var parser = new commonmark.DocParser();
var renderer = new commonmark.HtmlRenderer();

exports.run = function(data) {
  return renderer.render(parser.parse(data));
}

