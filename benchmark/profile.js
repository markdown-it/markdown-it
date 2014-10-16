#!/usr/bin/env node
/*eslint no-console:0*/
'use strict';

var fs = require('fs');
var path = require('path');
var Remarkable = require('../');

var md = new Remarkable({
  html: true,
  linkify: true,
  typographer: true
});

var data = fs.readFileSync(path.join(__dirname, '/samples/lorem1.txt'), 'utf8');

for (var i = 0; i < 200; i++) {
  md.render(data);
}
