'use strict';

var assert = require('chai').assert;

function asertTokenContent(src, token, content) {
  assert.strictEqual(src.slice(token.position, token.position + token.size), content);
}

describe.only('Annotation', function() {
  var md = require('../')({
    html: true,
    langPrefix: '',
    typographer: false,
    linkify: false
  });

  it('should annotate paragraph', function () {
    var tokens = md.parse('Hello World\n\nThis is great !');
    assert.strictEqual(tokens.length, 6);

    // First paragraph
    assert.strictEqual(tokens[0].position, 0);
    assert.strictEqual(tokens[0].size, 0);
    assert.strictEqual(tokens[1].position, 0);
    assert.strictEqual(tokens[1].size, 11);
    assert.strictEqual(tokens[2].position, 11);
    assert.strictEqual(tokens[2].size, 0);

    // Second paragraph
    assert.strictEqual(tokens[3].position, 13);
    assert.strictEqual(tokens[3].size, 0);
    assert.strictEqual(tokens[4].position, 13);
    assert.strictEqual(tokens[4].size, 15);
    assert.strictEqual(tokens[5].position, 28);
    assert.strictEqual(tokens[5].size, 0);
  });

  it('should annotate headings', function () {
    var tokens = md.parse('# Hello\n\n## World ##\n');
    assert.strictEqual(tokens.length, 6);

    // First heading
    assert.strictEqual(tokens[0].position, 0);
    assert.strictEqual(tokens[0].size, 1);
    assert.strictEqual(tokens[1].position, 1);
    assert.strictEqual(tokens[1].size, 6);
    assert.strictEqual(tokens[2].position, 7);
    assert.strictEqual(tokens[2].size, 0);

    // Second heading
    assert.strictEqual(tokens[3].position, 9);
    assert.strictEqual(tokens[3].size, 2);
    assert.strictEqual(tokens[4].position, 11);
    assert.strictEqual(tokens[4].size, 7);
    assert.strictEqual(tokens[5].position, 18);
    assert.strictEqual(tokens[5].size, 2);
  });

  it('should annotate lheadings', function () {
    var src = 'Hello\n=====\n\nWorld\n=======';
    var tokens = md.parse(src);
    assert.strictEqual(tokens.length, 6);

    // First heading
    assert.strictEqual(tokens[0].position, 0);
    asertTokenContent(src, tokens[0], '');
    asertTokenContent(src, tokens[1], 'Hello');
    asertTokenContent(src, tokens[2], '=====\n');

    // Second heading
    assert.strictEqual(tokens[3].position, 13);
    assert.strictEqual(tokens[3].size, 0);
    asertTokenContent(src, tokens[4], 'World');
    asertTokenContent(src, tokens[5], '=======');
  });

  it('should annotate code blocks', function () {
    var tokens = md.parse('\tHello\n\tWorld\n\nt\n\n\tBlock 2\n');
    assert.strictEqual(tokens.length, 5);

    assert.strictEqual(tokens[0].position, 0);
    assert.strictEqual(tokens[0].size, 14);

    assert.strictEqual(tokens[4].position, 18);
    assert.strictEqual(tokens[4].size, 9);
  });


});

