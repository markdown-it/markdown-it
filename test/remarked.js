/*global describe*/
'use strict';


var path = require('path');


var utils = require('./utils');
var Remarked = require('../');


describe('remarked', function () {
  var md = new Remarked();

  utils.addTests(path.join(__dirname, 'fixtures/remarked_ok'), md);
});


describe('remarked pending', function () {
  var md = new Remarked();

  utils.addTests(path.join(__dirname, 'fixtures/remarked_pending'), md, true);
});
