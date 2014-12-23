# markdown-it

[![Build Status](https://img.shields.io/travis/markdown-it/markdown-it/master.svg?style=flat)](https://travis-ci.org/markdown-it/markdown-it)
[![NPM version](https://img.shields.io/npm/v/markdown-it.svg?style=flat)](https://www.npmjs.org/package/markdown-it)
[![Coverage Status](https://img.shields.io/coveralls/markdown-it/markdown-it/master.svg?style=flat)](https://coveralls.io/r/markdown-it/markdown-it?branch=dev)

> Markdown parser done right. Fast and easy to extend.

__[Live demo](https://markdown-it.github.io)__

- Supports the CommonMark spec + syntax extensions + sugar (URL autolinking, typographer).
- Configurable syntax! You can add new rules and even replace existing ones.
- High speed!
- Community written __[plugins](https://www.npmjs.org/browse/keyword/markdown-it-plugin)__ and [utilities](https://www.npmjs.org/browse/keyword/markdown-it) on npm.

__Table of content__

- [Install](#install)
- [Usage](#usage)
  - [Configuring](#configuring)
    - [constructor(preset, options)](#constructorpreset-options)
    - [.set({ keys: values })](#set-keys-values-)
    - [.use(plugin, options)](#useplugin-options)
  - [Syntax highlighting](#syntax-highlighting)
  - [Typographer](#typographer)
  - [Syntax extensions](#syntax-extensions)
  - [Manage rules](#manage-rules)
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


## Usage

```js
// node.js, "classic" way:
var MarkdownIt = require('markdown-it'),
    md = new MarkdownIt();
console.log(md.render('# markdown-it rulezz!'));

// node.js, the same, but with sugar:
var md = require('markdown-it')();
console.log(md.render('# markdown-it rulezz!'));

// browser without AMD, added to "window" on script load
// Note, there are no dash.
var md = window.markdownit();
console.log(md.render('# markdown-it rulezz!'));
```


### Configuring

By default `markdown-it` is configured to be similar to GFM, but with HTML disabled.
This is easy to change if you prefer different settings.

Usually, you will define everything via constructor.

#### constructor(preset, options)

__preset__ (String) - `"full"`|`"commonmark"`, optional.

`markdown-it` offers some presets as a convenience to quickly enable/disable
active syntax rules and options for common use cases.

- ["commonmark"](https://github.com/markdown-it/markdown-it/blob/master/lib/presets/commonmark.js) - enable strict [CommonMark](http://commonmark.org/) mode.
- ["full"](https://github.com/markdown-it/markdown-it/blob/master/lib/presets/full.js) -
  all rules enabled, but still without html, typographer & autolinker.
- [default](https://github.com/markdown-it/markdown-it/blob/master/lib/presets/default.js) -
  when no preset name given.


```js
// commonmark mode:
var md = require('markdown-it')('commonmark');

// default mode:
var md = require('markdown-it')();

// enable everything:
var md = require('markdown-it')('full', {
  html: true,
  linkify: true,
  typographer: true
});
```

__options__

```js
// Actual default values
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


#### .set({ keys: values })

Probably, you will never need it. But you can change options after
constructor call.

```js
var md = require('markdown-it')();
            .set({ html: true, breaks: true })
            .set({ typographer, true });
```

**Note:** To achieve the best possible performance, don't modify a `markdown-it`
instance on the fly. If you need multiple configurations it's best to create
multiple instances and initialize each with separate config.


#### .use(plugin, options)

Sugar to activate plugins.

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
      } catch (err) {}
    }

    try {
      return hljs.highlightAuto(str).value;
    } catch (err) {}

    return ''; // use external default escaping
  }
});
```


### Typographer

Although full-weight typographical replacements are language specific, `markdown-it`
provides coverage for the most common and universal use cases:

```js
var md = require('markdown-it')({
  typographer: true,
  quotes: '“”‘’'
});

// Disable rules at all:
md.disable([ 'replacements', 'smartquotes' ]);

// Actual default replacements:
//
// '' → ‘’
// "" → “”. Set '«»' for Russian, '„“' for German, empty to disable
// (c) (C) → ©
// (tm) (TM) → ™
// (r) (R) → ®
// +- → ±
// (p) (P) -> §
// ... → … (also ?.... → ?.., !.... → !..)
// ???????? → ???, !!!!! → !!!, `,,` → `,`
// -- → &ndash;, --- → &mdash;
//
```

Of course, you can also add your own rules or replace the defaults with something
more advanced or specific to your language.


### Syntax extensions

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
var md = require('markdown-it')();
            .enable([ 'ins', 'mark' ])
            .disable([ 'table' ]);

// Enable everything
md = require('markdown-it')('full', {
  html: true,
  linkify: true,
  typographer: true,
});

// Manually enable rules, disabled by default:
var md = require('markdown-it')();
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
Because it's written in monomorphyc style and use JIT inline caches effectively.


## Authors

- Alex Kocharin [github/rlidwka](https://github.com/rlidwka)
- Vitaly Puzrin [github/puzrin](https://github.com/puzrin)


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
