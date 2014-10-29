# remarkable

[![Build Status](https://travis-ci.org/jonschlinkert/remarkable.svg?branch=master)](https://travis-ci.org/jonschlinkert/remarkable)
[![NPM version](https://img.shields.io/npm/v/remarkable.svg)](https://www.npmjs.org/package/remarkable)
[![Coverage Status](https://img.shields.io/coveralls/jonschlinkert/remarkable.svg)](https://coveralls.io/r/jonschlinkert/remarkable?branch=dev)

> Markdown parser done right. Fast and easy to extend.

__[Live demo](http://jonschlinkert.github.io/remarkable/demo/)__

- Supports the [CommonMark](http://commonmark.org/) spec + extentions
  (URL autolinking, typographer).
- Configurable syntax! You can add new rules and even replace existing ones.
- High speed! See the [benchmarks](./benchmark).


## Install

**node.js:**

```bash
npm install remarkable --save
```

**bower:**

```bash
bower install remarkable --save
```

**browser (CDN):**

- [jsDeliver CDN](http://www.jsdelivr.com/#!remarkable "jsDelivr CDN")


## Usage

```js
var Remarkable = require('remarkable');
var md = new Remarkable();

console.log(md.render('# Remarkable rulezz!'));
// => <h1>Remarkable rulezz!</h1>
```


### Options

By default remarkable is configured to be similar to GFM, but with HTML disabled.
This is easy to change if you prefer to use different settings.

There are two ways to define options.

#### constructor

Define options in the constructor:

```js
// Actual default values
var md = new Remarkable({
  html:         false,        // Enable HTML tags in source
  xhtmlOut:     false,        // Use '/' to close single tags (<br />)
  breaks:       false,        // Convert '\n' in paragraphs into <br>
  langPrefix:   'language-',  // CSS language prefix for fenced blocks
  linkify:      false,        // Autoconvert URL-like text to links
  typographer:  false,        // Enable smartypants and other sweet transforms

  // Highlighter function. Should return escaped HTML,
  // or '' if the source string is not changed
  highlight: function (/*str, lang*/) { return ''; }
});

console.log(md.render('# Remarkable rulezz!'));
// => <h1>Remarkable rulezz!</h1>
```

#### .set

Or define options via the `.set()` method:

```js
var Remarkable = require('remarkable');
var md = new Remarkable();

md.set({
  html: true,
  breaks: true
});
```

**Note:** To achieve the best possible performance, don't modify a `Remarkable`
instance on the fly. If you need multiple configurations it's best to create
multiple instances and initialize each with a configuration that is ideal for
that instance.


### Presets

Remarkable offers some "presets" as a convenience to quickly enable/disable
active syntax rules and options for common use cases.

#### commonmark

Enable strict [CommonMark](http://commonmark.org/) mode with the `commonmark` preset:

```js
var Remarkable = require('remarkable');
var md = new Remarkable('commonmark');
```

#### full

Enable all available rules (but still with default options, if not set):

```js
var Remarkable = require('remarkable');
var md = new Remarkable('full');

// Or with options:
var md = new Remarkable('full', {
  html: true,
  linkify: true,
  typographer: true
});
```


### Syntax highlighting

Apply syntax highlighting to fenced code blocks with the `highlight` option:

```js
var Remarkable = require('remarkable');
var hljs       = require('highlight.js') // https://highlightjs.org/

// Actual default values
var md = new Remarkable({
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


### Syntax extentions

Enabled by default:

- [Tables](https://help.github.com/articles/github-flavored-markdown/#tables) (GFM)
- [\<del>](https://help.github.com/articles/github-flavored-markdown/#strikethrough)
  (GFM strikethrough) - `~~deleted text~~`

Disabled by default:

- [\<sup](http://johnmacfarlane.net/pandoc/README.html#superscripts-and-subscripts) - `19^th^`
- [\<sub>](http://johnmacfarlane.net/pandoc/README.html#superscripts-and-subscripts) - `H~2~0`
- __\<ins>__ - `++inserted text++` (experimental)
- __\<mark>__ - `==marked text==` (experimental)

__*__ Experimental extentions can be changed later for something like
[Critic Markup](http://criticmarkup.com/), but you will still be able to use
old-style rules via external plugins if you prefer.


### Manage rules

```js
var md = new Remarkable();
md.inline.ruler.enable([ 'ins', 'mark' ]);
md.block.ruler.disable([ 'table' ]);

// Enable everything
md = new Remarkable('full', {
  html: true,
  linkify: true,
  typographer: true,
});
```


### Typographer

Although full-weight typographical replacements are language specific, `remarkable`
provides coverage for the most common and universal use cases:

```js
var Remarkable = require('remarkable');
var md = new Remarkable({ typographer: true });

// Actual default values
md.typographer.set({
  singleQuotes: '‘’', // set empty to disable
  doubleQuotes: '“”', // set '«»' for Russian, '„“' for German, empty to disable
  copyright:    true, // (c) (C) → ©
  trademark:    true, // (tm) (TM) → ™
  registered:   true, // (r) (R) → ®
  plusminus:    true, // +- → ±
  paragraph:    true, // (p) (P) -> §
  ellipsis:     true, // ... → … (also ?.... → ?.., !.... → !..)
  dupes:        true, // ???????? → ???, !!!!! → !!!, `,,` → `,`
  dashes:       true  // -- → &ndash;, --- → &mdash;
})
```

Of course, you can also add your own rules or replace the defaults with something
more advanced or specific to your language.


### Plugins

Easily load plugins with the `.use()` method:

```js
var md = new Remarkable();

md.use(plugin1)
  .use(plugin2, opts)
  .use(plugin3);
```


## References / Thanks

Big thanks to [John MacFarlane](https://github.com/jgm) for his work on the
CommonMark spec and reference implementations. His work saved us a lot of time
during this project's development.

**Related Links:**

1. https://github.com/jgm/CommonMark - reference CommonMark implementations in C & JS,
   also contains latest spec & online demo.
2. http://talk.commonmark.org - CommonMark forum, good place to collaborate
   developers' efforts.


## Development / Modification

Parser consists of several responsibilities chains, filled with rules. You can
reconfigure anyone as you wish. Render also can be modified and extended. See
source code to understand details. Pay attention to these properties:

```js
Remarkable.block
Remarkable.block.ruler
Remarkable.inline
Remarkable.inline.ruler
Remarkable.typographer
Remarkable.typographer.ruler
Remarkable.linkifier
Remarkable.linkifier.ruler
Remarkable.renderer
Remarkable.renderer.rules
```


## Authors

- Jon Schlinkert [github/jonschlinkert](https://github.com/jonschlinkert)
- Alex Kocharin [github/rlidwka](https://github.com/rlidwka)
- Vitaly Puzrin [github/puzrin](https://github.com/puzrin)


## License

[MIT](https://github.com/jonschlinkert/remarkable/blob/master/LICENSE)
