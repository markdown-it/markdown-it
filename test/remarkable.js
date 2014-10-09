/*global describe*/
'use strict';


var path = require('path');


var utils = require('./utils');
var Remarked = require('../');


describe('Default', function () {
  var md = new Remarked({
    langPrefix: '',
    typographer: true,
    linkify: true
  });

  utils.addSpecTests(path.join(__dirname, 'fixtures/remarkable'), md);
});
