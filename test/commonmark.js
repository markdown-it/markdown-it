/*global describe*/
'use strict';


var path = require('path');


var utils = require('./utils');


describe('CommonMark', function () {
  var md = require('../')('commonmark');

  utils.addTests(path.join(__dirname, 'fixtures/commonmark/good.txt'), md);
});
