#!/usr/bin/env node

// Build demo data for embedding into html

/*eslint no-console:0*/

var fs   = require('fs');
var path = require('path');

console.log(JSON.stringify({
  self: {
    demo: {
      code:   fs.readFileSync(path.join(__dirname, '../demo/sample.js'), 'utf8'),
      source: fs.readFileSync(path.join(__dirname, '../demo/sample.md'), 'utf8')
    }
  }
}, null, 2));
