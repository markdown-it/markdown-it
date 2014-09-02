'use strict'

var Remarkable = new require('../../../');
var md = new Remarkable();

exports.run = function(data) {
  return md.render(data);
}
