'use strict';


var assert     = require('chai').assert;
var markdownit = require('../');


describe('API', function () {

  it('constructor', function () {
    assert.throws(function () {
      markdownit('bad preset');
    });

    // options should override preset
    var md = markdownit('commonmark', { html: false });
    assert.strictEqual(md.render('<!-- -->'), '<p>&lt;!-- --&gt;</p>\n');
  });

  it('configure coverage', function () {
    var md = markdownit();

    // conditions coverage
    md.configure({});
    assert.strictEqual(md.render('123'), '<p>123</p>\n');

    assert.throws(function () {
      md.configure();
    });
  });

  it('plugin', function () {
    var succeeded = false;

    function plugin(slf, opts) { if (opts === 'bar') { succeeded = true; } }

    var md = markdownit();

    md.use(plugin, 'foo');
    assert.strictEqual(succeeded, false);
    md.use(plugin, 'bar');
    assert.strictEqual(succeeded, true);
  });

  it('highlight', function () {
    var md = markdownit({
      highlight: function (str) {
        return '<pre><code>==' + str + '==</code></pre>';
      }
    });

    assert.strictEqual(md.render('```\nhl\n```'), '<pre><code>==hl\n==</code></pre>\n');
  });

  it('highlight escape by default', function () {
    var md = markdownit({
      highlight: function () {
        return '';
      }
    });

    assert.strictEqual(md.render('```\n&\n```'), '<pre><code>&amp;\n</code></pre>\n');
  });

  it('force hardbreaks', function () {
    var md = markdownit({ breaks: true });

    assert.strictEqual(md.render('a\nb'), '<p>a<br>\nb</p>\n');
    md.set({ xhtmlOut: true });
    assert.strictEqual(md.render('a\nb'), '<p>a<br />\nb</p>\n');
  });

  it('xhtmlOut enabled', function () {
    var md = markdownit({ xhtmlOut: true });

    assert.strictEqual(md.render('---'), '<hr />\n');
    assert.strictEqual(md.render('![]()'), '<p><img src="" alt="" /></p>\n');
    assert.strictEqual(md.render('a  \\\nb'), '<p>a  <br />\nb</p>\n');
  });

  it('xhtmlOut disabled', function () {
    var md = markdownit();

    assert.strictEqual(md.render('---'), '<hr>\n');
    assert.strictEqual(md.render('![]()'), '<p><img src="" alt=""></p>\n');
    assert.strictEqual(md.render('a  \\\nb'), '<p>a  <br>\nb</p>\n');
  });

  it('bulk enable/disable rules in different chains', function () {
    var md = markdownit();

    var was = {
      core: md.core.ruler.getRules('').length,
      block: md.block.ruler.getRules('').length,
      inline: md.inline.ruler.getRules('').length
    };

    // Disable 2 rule in each chain & compare result
    md.disable([ 'block', 'inline', 'code', 'fence', 'emphasis', 'entity' ]);

    var now = {
      core: md.core.ruler.getRules('').length + 2,
      block: md.block.ruler.getRules('').length + 2,
      inline: md.inline.ruler.getRules('').length + 2
    };

    assert.deepEqual(was, now);

    // Enable the same rules back
    md.enable([ 'block', 'inline', 'code', 'fence', 'emphasis', 'entity' ]);

    var back = {
      core: md.core.ruler.getRules('').length,
      block: md.block.ruler.getRules('').length,
      inline: md.inline.ruler.getRules('').length
    };

    assert.deepEqual(was, back);
  });

  it('bulk enable/disable with errors control', function () {
    var md = markdownit();

    assert.throws(function () {
      md.enable([ 'link', 'code', 'invalid' ]);
    });
    assert.throws(function () {
      md.disable([ 'link', 'code', 'invalid' ]);
    });
    assert.doesNotThrow(function () {
      md.enable([ 'link', 'code' ]);
    });
    assert.doesNotThrow(function () {
      md.disable([ 'link', 'code' ]);
    });
  });

  it('bulk enable/disable should understand strings', function () {
    var md = markdownit();

    md.disable('emphasis');
    assert(md.renderInline('_foo_'), '_foo_');

    md.enable('emphasis');
    assert(md.renderInline('_foo_'), '<em>foo</em>');
  });

  it('input type check', function () {
    var md = markdownit();

    assert.throws(
      function () { md.render(null); },
      /Input data should be a String/
    );
  });

});


describe('Misc', function () {

  it('Should replace NULL characters', function () {
    var md = markdownit();

    assert.strictEqual(md.render('foo\u0000bar'), '<p>foo\uFFFDbar</p>\n');
  });

  it('Should correctly parse strings without tailing \\n', function () {
    var md = markdownit();

    assert.strictEqual(md.render('123'), '<p>123</p>\n');
    assert.strictEqual(md.render('123\n'), '<p>123</p>\n');
  });

  it('Should quickly exit on empty string', function () {
    var md = markdownit();

    assert.strictEqual(md.render(''), '');
  });

  it('Should parse inlines only', function () {
    var md = markdownit();

    assert.strictEqual(md.renderInline('a *b* c'), 'a <em>b</em> c');
  });

  it('Renderer should have pluggable inline and block rules', function () {
    var md = markdownit();

    md.renderer.rules.em_open = function () { return '<it>'; };
    md.renderer.rules.em_close = function () { return '</it>'; };
    md.renderer.rules.paragraph_open = function () { return '<par>'; };
    md.renderer.rules.paragraph_close = function () { return '</par>'; };

    assert.strictEqual(md.render('*b*'), '<par><it>b</it></par>');
  });

  it('Zero preset should disable everything', function () {
    var md = markdownit('zero');

    assert.strictEqual(md.render('___foo___'), '<p>___foo___</p>\n');
    assert.strictEqual(md.renderInline('___foo___'), '___foo___');

    md.enable('emphasis');

    assert.strictEqual(md.render('___foo___'), '<p><em><strong>foo</strong></em></p>\n');
    assert.strictEqual(md.renderInline('___foo___'), '<em><strong>foo</strong></em>');
  });

  it('Should correctly check block termination rules when those are disabled (#13)', function () {
    var md = markdownit('zero');

    assert.strictEqual(md.render('foo\nbar'), '<p>foo\nbar</p>\n');
  });

  it('Should render link target attr', function () {
    var md = markdownit()
      .use(require('markdown-it-for-inline'), 'target', 'link_open', function (tokens, idx) {
        tokens[idx].attrs.push([ 'target', '_blank' ]);
      });

    assert.strictEqual(md.render('[foo](bar)'), '<p><a href="bar" target="_blank">foo</a></p>\n');
  });

  it('Should normalize CR to LF', function () {
    var md = markdownit();

    assert.strictEqual(
      md.render('# test\r\r - hello\r - world\r'),
      md.render('# test\n\n - hello\n - world\n')
    );
  });

  it('Should normalize CR+LF to LF', function () {
    var md = markdownit();

    assert.strictEqual(
      md.render('# test\r\n\r\n - hello\r\n - world\r\n'),
      md.render('# test\n\n - hello\n - world\n')
    );
  });
});


describe('Url normalization', function () {

  it('Should be overridable', function () {
    var md = markdownit({ linkify: true });

    md.normalizeLink = function (url) {
      assert(url.match(/example\.com/), 'wrong url passed');
      return 'LINK';
    };
    md.normalizeLinkText = function (url) {
      assert(url.match(/example\.com/), 'wrong url passed');
      return 'TEXT';
    };

    assert.strictEqual(md.render('foo@example.com'), '<p><a href="LINK">TEXT</a></p>\n');
    assert.strictEqual(md.render('http://example.com'), '<p><a href="LINK">TEXT</a></p>\n');
    assert.strictEqual(md.render('<foo@example.com>'), '<p><a href="LINK">TEXT</a></p>\n');
    assert.strictEqual(md.render('<http://example.com>'), '<p><a href="LINK">TEXT</a></p>\n');
    assert.strictEqual(md.render('[test](http://example.com)'), '<p><a href="LINK">test</a></p>\n');
    assert.strictEqual(md.render('![test](http://example.com)'), '<p><img src="LINK" alt="test"></p>\n');
  });

});


describe('Links validation', function () {

  it('Override validator, disable everything', function () {
    var md = markdownit({ linkify: true });

    md.validateLink = function () { return false; };

    assert.strictEqual(md.render('foo@example.com'), '<p>foo@example.com</p>\n');
    assert.strictEqual(md.render('http://example.com'), '<p>http://example.com</p>\n');
    assert.strictEqual(md.render('<foo@example.com>'), '<p>&lt;foo@example.com&gt;</p>\n');
    assert.strictEqual(md.render('<http://example.com>'), '<p>&lt;http://example.com&gt;</p>\n');
    assert.strictEqual(md.render('[test](http://example.com)'), '<p>[test](http://example.com)</p>\n');
    assert.strictEqual(md.render('![test](http://example.com)'), '<p>![test](http://example.com)</p>\n');
  });

});


describe('maxNesting', function () {

  it('Block parser should not nest above limit', function () {
    var md = markdownit({ maxNesting: 2 });
    assert.strictEqual(
      md.render('>foo\n>>bar\n>>>baz'),
      '<blockquote>\n<p>foo</p>\n<blockquote></blockquote>\n</blockquote>\n'
    );
  });

  it('Inline parser should not nest above limit', function () {
    var md = markdownit({ maxNesting: 1 });
    assert.strictEqual(
      md.render('[`foo`]()'),
      '<p><a href="">`foo`</a></p>\n'
    );
  });

  it('Inline nesting coverage', function () {
    var md = markdownit({ maxNesting: 2 });
    assert.strictEqual(
      md.render('[[[[[[[[[[[[[[[[[[foo]()'),
      '<p>[[[[[[[[[[[[[[[[[[foo]()</p>\n'
    );
  });

});


describe('smartquotes', function () {
  var md = markdownit({
    typographer: true,

    // all strings have different length to make sure
    // we didn't accidentally count the wrong one
    quotes: [ '[[[', ']]', '(((((', '))))' ]
  });

  it('Should support multi-character quotes', function () {
    assert.strictEqual(
      md.render('"foo" \'bar\''),
      '<p>[[[foo]] (((((bar))))</p>\n'
    );
  });

  it('Should support nested multi-character quotes', function () {
    assert.strictEqual(
      md.render('"foo \'bar\' baz"'),
      '<p>[[[foo (((((bar)))) baz]]</p>\n'
    );
  });

  it('Should support multi-character quotes in different tags', function () {
    assert.strictEqual(
      md.render('"a *b \'c *d* e\' f* g"'),
      '<p>[[[a <em>b (((((c <em>d</em> e)))) f</em> g]]</p>\n'
    );
  });

});


describe('Token attributes', function () {
  it('.attrJoin', function () {
    var md = markdownit();

    var tokens = md.parse('```'),
        t = tokens[0];

    t.attrJoin('class', 'foo');
    t.attrJoin('class', 'bar');

    assert.strictEqual(
      md.renderer.render(tokens, md.options),
      '<pre><code class="foo bar"></code></pre>\n'
    );
  });

  it('.attrSet', function () {
    var md = markdownit();

    var tokens = md.parse('```'),
        t = tokens[0];

    t.attrSet('class', 'foo');

    assert.strictEqual(
      md.renderer.render(tokens, md.options),
      '<pre><code class="foo"></code></pre>\n'
    );

    t.attrSet('class', 'bar');

    assert.strictEqual(
      md.renderer.render(tokens, md.options),
      '<pre><code class="bar"></code></pre>\n'
    );
  });

  it('.attrGet', function () {
    var md = markdownit();

    var tokens = md.parse('```'),
        t = tokens[0];

    assert.strictEqual(t.attrGet('myattr'), null);

    t.attrSet('myattr', 'myvalue');

    assert.strictEqual(t.attrGet('myattr'), 'myvalue');
  });
});
