'use strict';

var fs = require('fs');
var path = require('path');
var Remarkable = require('../');

var md = new Remarkable();

var data = fs.readFileSync(path.join(__dirname, '/samples/lorem1.txt', 'utf8'));

for (var i = 0; i < 20000; i++) {
  md.render(data);
}
