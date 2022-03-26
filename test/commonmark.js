'use strict';


let p      = require('path');
let load   = require('markdown-it-testgen').load;
let assert = require('chai').assert;


function normalize(text) {
  return text.replace(/<blockquote>\n<\/blockquote>/g, '<blockquote></blockquote>');
}


function generate(path, md) {
  load(path, function (data) {
    data.meta = data.meta || {};

    let desc = data.meta.desc || p.relative(path, data.file);

    (data.meta.skip ? describe.skip : describe)(desc, function () {
      data.fixtures.forEach(function (fixture) {
        it(fixture.header ? fixture.header : 'line ' + (fixture.first.range[0] - 1), function () {
          assert.strictEqual(md.render(fixture.first.text), normalize(fixture.second.text));
        });
      });
    });
  });
}


describe('CommonMark', function () {
  let md = require('../')('commonmark');

  generate(p.join(__dirname, 'fixtures/commonmark/good.txt'), md);
});
