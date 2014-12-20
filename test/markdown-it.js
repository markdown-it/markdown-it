'use strict';


var path = require('path');


var utils = require('./utils');


describe('markdownit', function () {
  var md = require('../')('full', {
    html: true,
    langPrefix: '',
    typographer: true,
    linkify: true
  });

  utils.addTests(path.join(__dirname, 'fixtures/markdown-it'), md);
});
