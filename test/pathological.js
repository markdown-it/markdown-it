'use strict';


var markdownit = require('../');


describe('Pathological sequences speed', function () {

  describe('Cmark', function () {
    //
    // Ported from cmark, https://github.com/commonmark/cmark/blob/master/test/pathological_tests.py
    //
    it('nested strong emph', function () {
      markdownit().render('*a **a '.repeat(5000) + 'b' + ' a** a*'.repeat(5000));
    });

    it('many emph closers with no openers', function () {
      markdownit().render('a_ '.repeat(30000));
    });

    it('many emph openers with no closers', function () {
      markdownit().render('_a '.repeat(30000));
    });

    it('many link closers with no openers', function () {
      markdownit().render('a]'.repeat(10000));
    });

    it('many link openers with no closers', function () {
      markdownit().render('[a'.repeat(10000));
    });

    it('mismatched openers and closers', function () {
      markdownit().render('*a_ '.repeat(50000));
    });

    it('openers and closers multiple of 3', function () {
      markdownit().render('a**b' + ('c* '.repeat(50000)));
    });

    it('link openers and emph closers', function () {
      markdownit().render('[ a_'.repeat(10000));
    });

    it('pattern [ (]( repeated', function () {
      markdownit().render('[ (]('.repeat(40000));
    });

    it('nested brackets', function () {
      markdownit().render('['.repeat(20000) + 'a' + ']'.repeat(20000));
    });

    it('nested block quotes', function () {
      markdownit().render('> '.repeat(50000) + 'a');
    });

    it('deeply nested lists', function () {
      markdownit().render(Array(1000).fill(0).map(function (_, x) { return '  '.repeat(x) + '* a\n'; }).join(''));
    });

    it('backticks', function () {
      markdownit().render(Array(3000).fill(0).map(function (_, x) { return 'e' + '`'.repeat(x); }).join(''));
    });

    it('unclosed links A', function () {
      markdownit().render('[a](<b'.repeat(30000));
    });

    it('unclosed links B', function () {
      markdownit().render('[a](b'.repeat(30000));
    });
  });
});
