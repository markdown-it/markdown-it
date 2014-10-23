/*global describe*/
'use strict';


var path = require('path');


var utils = require('./utils');
var Remarkable = require('../');


describe('remarkable', function () {
  var md = new Remarkable({
    html: true,
    langPrefix: '',
    typographer: true,
    linkify: true
  });

  utils.addSpecTests(path.join(__dirname, 'fixtures/remarkable'), md);
});
