#!/usr/bin/env node

// Build demo data for embedding into html

/*eslint-disable no-console*/
'use strict';

var fs   = require('fs');
var path = require('path');

console.log(JSON.stringify({
  self: {
    demo: {
      source: fs.readFileSync(path.join(__dirname, './demo_template/sample.md'), 'utf8')
    }
  }
}, null, 2));
