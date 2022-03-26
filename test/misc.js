'use strict';


let assert     = require('chai').assert;
let markdownit = require('../');


describe('API', function () {

  it('constructor', function () {
    assert.throws(function () {
      markdownit('bad preset');
    });

    // options should override preset
    let md = markdownit('commonmark', { html: false });
    assert.strictEqual(md.render('<!-- -->'), '<p>&lt;!-- --&gt;</p>\n');
  });

  it('configure coverage', function () {
    let md = markdownit();

    // conditions coverage
    md.configure({});
    assert.strictEqual(md.render('123'), '<p>123</p>\n');

    assert.throws(function () {
      md.configure();
    });
  });

  it('plugin', function () {
    let succeeded = false;

    function plugin(slf, opts) { if (opts === 'bar') { succeeded = true; } }

    let md = markdownit();

    md.use(plugin, 'foo');
    assert.strictEqual(succeeded, false);
    md.use(plugin, 'bar');
    assert.strictEqual(succeeded, true);
  });

  it('highlight', function () {
    let md = markdownit({
      highlight: function (str) {
        return '<pre><code>==' + str + '==</code></pre>';
      }
    });

    assert.strictEqual(md.render('```\nhl\n```'), '<pre><code>==hl\n==</code></pre>\n');
  });

  it('highlight escape by default', function () {
    let md = markdownit({
      highlight: function () {
        return '';
      }
    });

    assert.strictEqual(md.render('```\n&\n```'), '<pre><code>&amp;\n</code></pre>\n');
  });

  it('highlight arguments', function () {
    let md = markdownit({
      highlight: function (str, lang, attrs) {
        assert.strictEqual(lang, 'a');
        assert.strictEqual(attrs, 'b  c  d');
        return '<pre><code>==' + str + '==</code></pre>';
      }
    });

    assert.strictEqual(md.render('``` a  b  c  d \nhl\n```'), '<pre><code>==hl\n==</code></pre>\n');
  });

  it('force hardbreaks', function () {
    let md = markdownit({ breaks: true });

    assert.strictEqual(md.render('a\nb'), '<p>a<br>\nb</p>\n');
    md.set({ xhtmlOut: true });
    assert.strictEqual(md.render('a\nb'), '<p>a<br />\nb</p>\n');
  });

  it('xhtmlOut enabled', function () {
    let md = markdownit({ xhtmlOut: true });

    assert.strictEqual(md.render('---'), '<hr />\n');
    assert.strictEqual(md.render('![]()'), '<p><img src="" alt="" /></p>\n');
    assert.strictEqual(md.render('a  \\\nb'), '<p>a  <br />\nb</p>\n');
  });

  it('xhtmlOut disabled', function () {
    let md = markdownit();

    assert.strictEqual(md.render('---'), '<hr>\n');
    assert.strictEqual(md.render('![]()'), '<p><img src="" alt=""></p>\n');
    assert.strictEqual(md.render('a  \\\nb'), '<p>a  <br>\nb</p>\n');
  });

  it('bulk enable/disable rules in different chains', function () {
    let md = markdownit();

    let was = {
      core: md.core.ruler.getRules('').length,
      block: md.block.ruler.getRules('').length,
      inline: md.inline.ruler.getRules('').length
    };

    // Disable 2 rule in each chain & compare result
    md.disable([ 'block', 'inline', 'code', 'fence', 'emphasis', 'entity' ]);

    let now = {
      core: md.core.ruler.getRules('').length + 2,
      block: md.block.ruler.getRules('').length + 2,
      inline: md.inline.ruler.getRules('').length + 2
    };

    assert.deepEqual(was, now);

    // Enable the same rules back
    md.enable([ 'block', 'inline', 'code', 'fence', 'emphasis', 'entity' ]);

    let back = {
      core: md.core.ruler.getRules('').length,
      block: md.block.ruler.getRules('').length,
      inline: md.inline.ruler.getRules('').length
    };

    assert.deepEqual(was, back);
  });

  it('bulk enable/disable with errors control', function () {
    let md = markdownit();

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
    let md = markdownit();

    md.disable('emphasis');
    assert(md.renderInline('_foo_'), '_foo_');

    md.enable('emphasis');
    assert(md.renderInline('_foo_'), '<em>foo</em>');
  });

  it('input type check', function () {
    let md = markdownit();

    assert.throws(
      function () { md.render(null); },
      /Input data should be a String/
    );
  });

});


describe('Misc', function () {

  it('Should replace NULL characters', function () {
    let md = markdownit();

    assert.strictEqual(md.render('foo\u0000bar'), '<p>foo\uFFFDbar</p>\n');
  });

  it('Should correctly parse strings without tailing \\n', function () {
    let md = markdownit();

    assert.strictEqual(md.render('123'), '<p>123</p>\n');
    assert.strictEqual(md.render('123\n'), '<p>123</p>\n');

    assert.strictEqual(md.render('    codeblock'), '<pre><code>codeblock\n</code></pre>\n');
    assert.strictEqual(md.render('    codeblock\n'), '<pre><code>codeblock\n</code></pre>\n');
  });

  it('Should quickly exit on empty string', function () {
    let md = markdownit();

    assert.strictEqual(md.render(''), '');
  });

  it('Should parse inlines only', function () {
    let md = markdownit();

    assert.strictEqual(md.renderInline('a *b* c'), 'a <em>b</em> c');
  });

  it('Renderer should have pluggable inline and block rules', function () {
    let md = markdownit();

    md.renderer.rules.em_open = function () { return '<it>'; };
    md.renderer.rules.em_close = function () { return '</it>'; };
    md.renderer.rules.paragraph_open = function () { return '<par>'; };
    md.renderer.rules.paragraph_close = function () { return '</par>'; };

    assert.strictEqual(md.render('*b*'), '<par><it>b</it></par>');
  });

  it('Zero preset should disable everything', function () {
    let md = markdownit('zero');

    assert.strictEqual(md.render('___foo___'), '<p>___foo___</p>\n');
    assert.strictEqual(md.renderInline('___foo___'), '___foo___');

    md.enable('emphasis');

    assert.strictEqual(md.render('___foo___'), '<p><em><strong>foo</strong></em></p>\n');
    assert.strictEqual(md.renderInline('___foo___'), '<em><strong>foo</strong></em>');
  });

  it('Should correctly check block termination rules when those are disabled (#13)', function () {
    let md = markdownit('zero');

    assert.strictEqual(md.render('foo\nbar'), '<p>foo\nbar</p>\n');
  });

  it('Should render link target attr', function () {
    let md = markdownit()
      .use(require('markdown-it-for-inline'), 'target', 'link_open', function (tokens, idx) {
        tokens[idx].attrs.push([ 'target', '_blank' ]);
      });

    assert.strictEqual(md.render('[foo](bar)'), '<p><a href="bar" target="_blank">foo</a></p>\n');
  });

  it('Should normalize CR to LF', function () {
    let md = markdownit();

    assert.strictEqual(
      md.render('# test\r\r - hello\r - world\r'),
      md.render('# test\n\n - hello\n - world\n')
    );
  });

  it('Should normalize CR+LF to LF', function () {
    let md = markdownit();

    assert.strictEqual(
      md.render('# test\r\n\r\n - hello\r\n - world\r\n'),
      md.render('# test\n\n - hello\n - world\n')
    );
  });
});


describe('Url normalization', function () {

  it('Should be overridable', function () {
    let md = markdownit({ linkify: true });

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
    let md = markdownit({ linkify: true });

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
    let md = markdownit({ maxNesting: 2 });
    assert.strictEqual(
      md.render('>foo\n>>bar\n>>>baz'),
      '<blockquote>\n<p>foo</p>\n<blockquote></blockquote>\n</blockquote>\n'
    );
  });

  it('Inline parser should not nest above limit', function () {
    let md = markdownit({ maxNesting: 1 });
    assert.strictEqual(
      md.render('[`foo`]()'),
      '<p><a href="">`foo`</a></p>\n'
    );
  });

  it('Inline nesting coverage', function () {
    let md = markdownit({ maxNesting: 2 });
    assert.strictEqual(
      md.render('[[[[[[[[[[[[[[[[[[foo]()'),
      '<p>[[[[[[[[[[[[[[[[[[foo]()</p>\n'
    );
  });

});


describe('smartquotes', function () {
  let md = markdownit({
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


describe('Ordered list info', function () {
  let md = markdownit();

  function type_filter(tokens, type) {
    return tokens.filter(function (t) { return t.type === type; });
  }

  it('Should mark ordered list item tokens with info', function () {
    let tokens = md.parse('1. Foo\n2. Bar\n20. Fuzz');
    assert.strictEqual(type_filter(tokens, 'ordered_list_open').length, 1);
    tokens = type_filter(tokens, 'list_item_open');
    assert.strictEqual(tokens.length, 3);
    assert.strictEqual(tokens[0].info, '1');
    assert.strictEqual(tokens[0].markup, '.');
    assert.strictEqual(tokens[1].info, '2');
    assert.strictEqual(tokens[1].markup, '.');
    assert.strictEqual(tokens[2].info, '20');
    assert.strictEqual(tokens[2].markup, '.');

    tokens = md.parse(' 1. Foo\n2. Bar\n  20. Fuzz\n 199. Flp');
    assert.strictEqual(type_filter(tokens, 'ordered_list_open').length, 1);
    tokens = type_filter(tokens, 'list_item_open');
    assert.strictEqual(tokens.length, 4);
    assert.strictEqual(tokens[0].info, '1');
    assert.strictEqual(tokens[0].markup, '.');
    assert.strictEqual(tokens[1].info, '2');
    assert.strictEqual(tokens[1].markup, '.');
    assert.strictEqual(tokens[2].info, '20');
    assert.strictEqual(tokens[2].markup, '.');
    assert.strictEqual(tokens[3].info, '199');
    assert.strictEqual(tokens[3].markup, '.');
  });
});


describe('Token attributes', function () {
  it('.attrJoin', function () {
    let md = markdownit();

    let tokens = md.parse('```'),
        t = tokens[0];

    t.attrJoin('class', 'foo');
    t.attrJoin('class', 'bar');

    assert.strictEqual(
      md.renderer.render(tokens, md.options),
      '<pre><code class="foo bar"></code></pre>\n'
    );
  });

  it('.attrSet', function () {
    let md = markdownit();

    let tokens = md.parse('```'),
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
    let md = markdownit();

    let tokens = md.parse('```'),
        t = tokens[0];

    assert.strictEqual(t.attrGet('myattr'), null);

    t.attrSet('myattr', 'myvalue');

    assert.strictEqual(t.attrGet('myattr'), 'myvalue');
  });
});
