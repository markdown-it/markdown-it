#!/usr/bin/env node
/*eslint no-console:0*/
'use strict';

var fs = require('fs');
var path = require('path');
var Remarkable = require('../');

var md = new Remarkable({
  html: true,
  xhtml: true,
  breaks: false,
  langPrefix: 'language-'
});

var data = fs.readFileSync(path.join(__dirname, '/samples/lorem1.txt'), 'utf8');

for (var i = 0; i < 20000; i++) {
  md.render(data);
}
