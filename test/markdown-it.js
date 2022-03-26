'use strict';


let path = require('path');


let generate = require('markdown-it-testgen');


describe('markdown-it', function () {
  let md = require('../')({
    html: true,
    langPrefix: '',
    typographer: true,
    linkify: true
  });

  generate(path.join(__dirname, 'fixtures/markdown-it'), md);
});
