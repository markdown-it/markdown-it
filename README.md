# markdown-it

[![Build Status](https://img.shields.io/travis/markdown-it/markdown-it/master.svg?style=flat)](https://travis-ci.org/markdown-it/markdown-it)
[![NPM version](https://img.shields.io/npm/v/markdown-it.svg?style=flat)](https://www.npmjs.org/package/markdown-it)
[![Coverage Status](https://img.shields.io/coveralls/markdown-it/markdown-it/master.svg?style=flat)](https://coveralls.io/r/markdown-it/markdown-it?branch=master)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/markdown-it/markdown-it)

> Markdown parser done right. Fast and easy to extend.

__[Live demo](https://markdown-it.github.io)__

- Supports the CommonMark spec + syntax extensions + sugar (URL autolinking, typographer).
- Configurable syntax! You can add new rules and even replace existing ones.
- High speed!
- Community-written __[plugins](https://www.npmjs.org/browse/keyword/markdown-it-plugin)__ and [other packages](https://www.npmjs.org/browse/keyword/markdown-it) on npm.

__Table of content__

- [Install](#install)
- [Usage examples](#usage-examples)
- [API](#api)
- [Syntax extensions](#syntax-extensions)
- [Benchmark](#benchmark)
- [Authors](#authors)
- [References / Thanks](#references--thanks)
- [License](#license)

## Install

**node.js** & **bower**:

```bash
npm install markdown-it --save
bower install markdown-it --save
```

**browser (CDN):**

- [jsDeliver CDN](http://www.jsdelivr.com/#!markdown-it "jsDelivr CDN")


## Usage examples

See also:

- __[API documentation](https://markdown-it.github.io/markdown-it/)__ - for more
  info and examples.
- [Development info](https://github.com/markdown-it/markdown-it/tree/master/docs) -
  for plugins writers.


### Simple

```js
// node.js, "classic" way:
var MarkdownIt = require('markdown-it'),
    md = new MarkdownIt();
var result = md.render('# markdown-it rulezz!');

// node.js, the same, but with sugar:
var md = require('markdown-it')();
var result = md.render('# markdown-it rulezz!');

// browser without AMD, added to "window" on script load
// Note, there are no dash.
var md = window.markdownit();
var result = md.render('# markdown-it rulezz!');
```

Single line rendering, without paragraph wrap:

```js
var md = require('markdown-it')();
var result = md.renderInline('__markdown-it__ rulezz!');
```


### Init with presets and options

(*) preset define combination of active rules and options. Can be
`"full"`|`"commonmark"`|`"zero"` or `"default"` if skipped.

```js
// commonmark mode
var md = require('markdown-it')('commonmark');

// default mode
var md = require('markdown-it')();

// enable everything
var md = require('markdown-it')('full', {
  html: true,
  linkify: true,
  typographer: true
});

// full options list (defaults)
var md = require('markdown-it')({
  html:         false,        // Enable HTML tags in source
  xhtmlOut:     false,        // Use '/' to close single tags (<br />).
                              // This is only for full CommonMark compatibility.
  breaks:       false,        // Convert '\n' in paragraphs into <br>
  langPrefix:   'language-',  // CSS language prefix for fenced blocks. Can be
                              // useful for external highlighters.
  linkify:      false,        // Autoconvert URL-like text to links

  // Enable some language-neutral replacement + quotes beautification
  typographer:  false,

  // Double + single quotes replacement pairs, when typographer enabled,
  // and smartquotes on. Set doubles to '«»' for Russian, '„“' for German.
  quotes: '“”‘’',

  // Highlighter function. Should return escaped HTML,
  // or '' if the source string is not changed and should be escaped externaly.
  highlight: function (/*str, lang*/) { return ''; }
});
```

### Plugins load

```js
var md = require('markdown-it')()
            .use(plugin1)
            .use(plugin2, opts)
            .use(plugin3);
```


### Syntax highlighting

Apply syntax highlighting to fenced code blocks with the `highlight` option:

```js
var hljs = require('highlight.js') // https://highlightjs.org/

// Actual default values
var md = require('markdown-it')({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (__) {}
    }

    try {
      return hljs.highlightAuto(str).value;
    } catch (__) {}

    return ''; // use external default escaping
  }
});
```


## API

[API documentation](https://markdown-it.github.io/markdown-it/)

If you are going to write plugins - take a look at
[Development info](https://github.com/markdown-it/markdown-it/tree/master/docs).


## Syntax extensions

Enabled by default:

- [Tables](https://help.github.com/articles/github-flavored-markdown/#tables) (GFM)
- [\<del>](https://help.github.com/articles/github-flavored-markdown/#strikethrough)
  (GFM strikethrough) - `~~deleted text~~`

Disabled by default:

- [\<sup>](http://johnmacfarlane.net/pandoc/README.html#superscripts-and-subscripts) - `19^th^`
- [\<sub>](http://johnmacfarlane.net/pandoc/README.html#superscripts-and-subscripts) - `H~2~0`
- [abbreviations](https://michelf.ca/projects/php-markdown/extra/#abbr)
- [footnotes](http://johnmacfarlane.net/pandoc/README.html#footnotes)
- __\<ins>__ - `++inserted text++` (experimental)
- __\<mark>__ - `==marked text==` (experimental)

__*__ Experimental extensions can be changed later for something like
[Critic Markup](http://criticmarkup.com/), but you will still be able to use
old-style rules via external plugins if you prefer.


### Manage rules

```js
// Activate/deactivate rules
var md = require('markdown-it')()
            .enable([ 'ins', 'mark' ])
            .disable([ 'table' ]);

// Enable everything
md = require('markdown-it')('full', {
  html: true,
  linkify: true,
  typographer: true,
});

// Manually enable rules, disabled by default:
var md = require('markdown-it')()
            .enable([
              /* core */
              'abbr',
              /* block */
              'footnote',
              'deflist',
              /* inline */
              'footnote_inline',
              'ins',
              'mark',
              'sub',
              'sup'
            ]);
```


## Benchmark

Here is result of CommonMark spec parse at Core i5 2.4 GHz (i5-4258U):

```bash
$ benchmark/benchmark.js spec
Selected samples: (1 of 27)
 > spec

Sample: spec.txt (110610 bytes)
 > commonmark-reference x 40.42 ops/sec ±4.07% (51 runs sampled)
 > current x 74.99 ops/sec ±4.69% (67 runs sampled)
 > current-commonmark x 93.76 ops/sec ±1.23% (79 runs sampled)
 > marked-0.3.2 x 22.92 ops/sec ±0.79% (41 runs sampled)
```

As you can see, `markdown-it` doesn't pay with speed for it's flexibility.
Because it's written in monomorphyc style and uses JIT inline caches effectively.


## Authors

- Alex Kocharin [github/rlidwka](https://github.com/rlidwka)
- Vitaly Puzrin [github/puzrin](https://github.com/puzrin)

_markdown-it_ is the result of the decision of the authors who contributed to
99% of the _Remarkable_ code to move to a project with the same authorship but
new leadership (Vitaly and Alex). It's not a fork.

## References / Thanks

Big thanks to [John MacFarlane](https://github.com/jgm) for his work on the
CommonMark spec and reference implementations. His work saved us a lot of time
during this project's development.

**Related Links:**

- https://github.com/jgm/CommonMark - reference CommonMark implementations in C & JS,
  also contains latest spec & online demo.
- http://talk.commonmark.org - CommonMark forum, good place to collaborate
  developers' efforts.

## License

[MIT](https://github.com/markdown-it/markdown-it/blob/master/LICENSE)
