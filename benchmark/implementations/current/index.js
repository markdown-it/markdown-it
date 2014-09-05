'use strict'

var Remarkable = require('../../../');
var md = new Remarkable();

exports.run = function(data) {
  return md.render(data);
}
