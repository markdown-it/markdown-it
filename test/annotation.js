'use strict';

var assert = require('chai').assert;

describe('Annotation', function() {
  var md = require('../')({
    html: true,
    langPrefix: '',
    typographer: true,
    linkify: true
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

});

