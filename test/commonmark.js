/*global describe*/
'use strict';


var path = require('path');


var utils = require('./utils');
var Remarked = require('../');


describe('CommonMark', function () {
  var md = new Remarked('commonmark');

  utils.addSpecTests(path.join(__dirname, 'fixtures/commonmark/good.txt'), md);
});
