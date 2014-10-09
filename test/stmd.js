/*global describe*/
'use strict';


var path = require('path');


var utils = require('./utils');
var Remarked = require('../');


describe('stmd', function () {
  var md = new Remarked('commonmark');

  utils.addSpecTests(path.join(__dirname, 'fixtures/stmd/good.txt'), md);
});
