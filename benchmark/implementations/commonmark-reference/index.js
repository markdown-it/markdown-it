'use strict';

var commonmark = require('commonmark');
var parser = new commonmark.Parser();
var renderer = new commonmark.HtmlRenderer();

exports.run = function(data) {
  return renderer.render(parser.parse(data));
};
