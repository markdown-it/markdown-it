#!/usr/bin/env node
/*eslint no-console:0*/
'use strict';

let fs = require('fs');
let path = require('path');

let md = require('../')({
  html: true,
  linkify: false,
  typographer: false
});

// var data = fs.readFileSync(path.join(__dirname, '/samples/lorem1.txt'), 'utf8');
let data = fs.readFileSync(path.join(__dirname, '../test/fixtures/commonmark/spec.txt'), 'utf8');

for (let i = 0; i < 20; i++) {
  md.render(data);
}
