'use strict';

var assert = require('chai').assert;

function assertTokenContent(src, token, content) {
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
    assertTokenContent(src, tokens[0], '');
    assertTokenContent(src, tokens[1], 'Hello');
    assertTokenContent(src, tokens[2], '=====\n');

    // Second heading
    assert.strictEqual(tokens[3].position, 13);
    assert.strictEqual(tokens[3].size, 0);
    assertTokenContent(src, tokens[4], 'World');
    assertTokenContent(src, tokens[5], '=======');
  });

  it('should annotate code blocks', function () {
    var tokens = md.parse('\tHello\n\tWorld\n\nt\n\n\tBlock 2\n');
    assert.strictEqual(tokens.length, 5);

    assert.strictEqual(tokens[0].position, 0);
    assert.strictEqual(tokens[0].size, 14);

    assert.strictEqual(tokens[4].position, 18);
    assert.strictEqual(tokens[4].size, 9);
  });

  it('should annotate tables', function () {
    var src = 'Test:\n\n' +
              ' | Type | Message |\n' +
              ' | ---- | ------- |\n' +
              '| Hello | World\n' +
              ' | Bonjour | Monde |\n';
    var tokens = md.parse(src);
    assert.strictEqual(tokens.length, 33);

    // Begin
    assert.strictEqual(tokens[3].position, 7);
    assert.strictEqual(tokens[3].size, 0);

    // head (open)
    assert.strictEqual(tokens[4].position, 7);
    assert.strictEqual(tokens[4].size, 0);

    // head -> TR (open)
    assert.strictEqual(tokens[5].position, 7);
    assert.strictEqual(tokens[5].size, 0);

    // head -> columns
    assertTokenContent(src, tokens[6], '|');
    assertTokenContent(src, tokens[7], ' Type ');
    assertTokenContent(src, tokens[8], '');
    assertTokenContent(src, tokens[9], '|');
    assertTokenContent(src, tokens[10], ' Message ');
    assertTokenContent(src, tokens[11], '|');

    // head -> TR (close)
    assert.strictEqual(tokens[12].position, 26);
    assert.strictEqual(tokens[12].size, 0);

    // head (close)
    assertTokenContent(src, tokens[13], ' | ---- | ------- |');

    // body (open)
    assert.strictEqual(tokens[14].position, 47);
    assert.strictEqual(tokens[14].size, 0);

    // body -> rows
    assertTokenContent(src, tokens[16], '|');
    assertTokenContent(src, tokens[17], ' Hello ');
    assertTokenContent(src, tokens[18], '');
    assertTokenContent(src, tokens[19], '|');
    assertTokenContent(src, tokens[20], ' World');
    assertTokenContent(src, tokens[21], '\n');

    assertTokenContent(src, tokens[24], '|');
    assertTokenContent(src, tokens[25], ' Bonjour ');
    assertTokenContent(src, tokens[26], '');
    assertTokenContent(src, tokens[27], '|');
    assertTokenContent(src, tokens[28], ' Monde ');
    assertTokenContent(src, tokens[29], '|');
  });


});

