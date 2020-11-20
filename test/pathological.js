'use strict';


const markdownit = require('../');
const needle = require('needle');
const assert = require('assert');
const crypto = require('crypto');

describe('Pathological sequences speed', () => {

  // Ported from cmark, https://github.com/commonmark/cmark/blob/master/test/pathological_tests.py
  describe('Cmark', () => {

    it('verify original source crc', async () => {
      /* eslint-disable  max-len */
      const src = await needle('get', 'https://raw.githubusercontent.com/commonmark/cmark/master/test/pathological_tests.py');
      const src_md5 = crypto.createHash('md5').update(src.body).digest('hex');

      assert.strictEqual(
        src_md5,
        require('./pathological.json').md5,
        'CRC or cmark pathological tests hanged. Verify and update pathological.json'
      );
    });

    it('nested strong emph', () => {
      markdownit().render('*a **a '.repeat(5000) + 'b' + ' a** a*'.repeat(5000));
    });

    it('many emph closers with no openers', () => {
      markdownit().render('a_ '.repeat(30000));
    });

    it('many emph openers with no closers', () => {
      markdownit().render('_a '.repeat(30000));
    });

    it('many link closers with no openers', () => {
      markdownit().render('a]'.repeat(10000));
    });

    it('many link openers with no closers', () => {
      markdownit().render('[a'.repeat(10000));
    });

    it('mismatched openers and closers', () => {
      markdownit().render('*a_ '.repeat(50000));
    });

    it('openers and closers multiple of 3', () => {
      markdownit().render('a**b' + ('c* '.repeat(50000)));
    });

    it('link openers and emph closers', () => {
      markdownit().render('[ a_'.repeat(10000));
    });

    it('pattern [ (]( repeated', () => {
      markdownit().render('[ (]('.repeat(40000));
    });

    it('nested brackets', () => {
      markdownit().render('['.repeat(20000) + 'a' + ']'.repeat(20000));
    });

    it('nested block quotes', () => {
      markdownit().render('> '.repeat(50000) + 'a');
    });

    it('deeply nested lists', () => {
      markdownit().render(Array(1000).fill(0).map(function (_, x) { return '  '.repeat(x) + '* a\n'; }).join(''));
    });

    it('backticks', () => {
      markdownit().render(Array(3000).fill(0).map(function (_, x) { return 'e' + '`'.repeat(x); }).join(''));
    });

    it('unclosed links A', () => {
      markdownit().render('[a](<b'.repeat(30000));
    });

    it('unclosed links B', () => {
      markdownit().render('[a](b'.repeat(30000));
    });
  });
});
