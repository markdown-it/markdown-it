'use strict';


var path = require('path');


var generate = require('markdown-it-testgen');


describe('CommonMark', function () {
  var md = require('../')('commonmark');

  generate(path.join(__dirname, 'fixtures/commonmark/good.txt'), md);
});
