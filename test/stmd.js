/*global describe*/
'use strict';


var path = require('path');


var utils = require('./utils');
var Remarked = require('../');


describe('stmd', function () {
  var md = new Remarked();

  utils.addTests(path.join(__dirname, 'fixtures/stmd_ok'), md);
});


describe('stmd pending', function () {
  var md = new Remarked();

  utils.addTests(path.join(__dirname, 'fixtures/stmd_pending'), md, true);
});


describe('stmd original with error', function () {
  var md = new Remarked();

  utils.addTests(path.join(__dirname, 'fixtures/stmd_conflicting'), md, true);
});
