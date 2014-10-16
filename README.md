cooming soon

remarkable
==========

[![Build Status](https://travis-ci.org/jonschlinkert/remarkable.svg?branch=master)](https://travis-ci.org/jonschlinkert/remarkable)
[![NPM version](https://img.shields.io/npm/v/remarkable.svg)](https://www.npmjs.org/package/remarkable)

Markdown parser done right. Fast and easy to extend.

__[Live demo](http://jonschlinkert.github.io/remarkable/demo/)__

- Configurable syntax! You can add new rules and even replace existing ones.
- Implements [CommonMark](http://commonmark.org/) spec + extentions
  (strikethrough, tables, URL autolinking, typographer).
- Very high speed.


## Install

node.js:

```bash
npm install remarkable --save
```

bower:

```bash
bower install remarkable --save
```


## Usage

```js
var Remarkable = require('remarkable');

// This values are default
var md = new Remarkable({
  html:         false,        // Enable html tags in source
  xhtmlOut:     false,        // Use '/' to close single tags (<br />)
  breaks:       false,        // Convert '\n' in paragraphs into <br>
  langPrefix:   'language-',  // CSS language prefix for fenced blocks
  linkify:      false,        // Autoconvert url-like texts to links
  typographer:  false,        // Enable smartypants and other sweet transforms

  // Highlighter function. Should return escaped html,
  // or '' if input not changed
  highlight: function (/*str, , lang*/) { return ''; }
});

console.log(md.parse('# Remarkable rulezz!'));
// => <h1>Remarkable rulezz!</h1>
```

You can define options via `set` method:

```js
var Remarkable = require('remarkable');
var md = new Remarkable();

md.set({
  html: false,
  breaks: true
});
```

__Note.__ To acheive best performance, don't modify `Remarkable` instance on
the fly. If you need several configurations - create multiple instances and
setup each appropriately.

You can also reset parser to strict [CommonMark](http://commonmark.org/) mode:

```js
var Remarkable = require('remarkable');
var md = new Remarkable('commonmark');
```

### Highligh fenced blocks

To highlight content of fenced block, assing function to `highlight` option:

```js
var Remarkable = require('remarkable');
var hljs       = require('highlight.js') // https://highlightjs.org/

// This values are default
var md = new Remarkable({
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

### Typorgapher

Though full weigh typograpic replacements are language specific, `remarkable`
provides the most common and universal case coverage:

```js
var Remarkable = require('remarkable');
var md = new Remarkable({ typographer: true });

// This values are default
md.typographer.set({
  singleQuotes: '‘’', // set empty to disable
  doubleQuotes: '“”', // set '«»' for russian, '„“' for deutch, empty to disable
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

Of cause, you can add your own rules or replace default one with something
more advanced, specific for your language.

### More extras

This extentions are enabled by default:

- [Strikethrough](https://help.github.com/articles/github-flavored-markdown/#strikethrough)
- [Tables](https://help.github.com/articles/github-flavored-markdown/#tables) (GFM)


## References / Thanks

Big thanks to [John MacFarlane](https://github.com/jgm) for his work on
CommonMark spec and reference implementations. His work saved us a lot of time
during this project development.

Links:

1. https://github.com/jgm/stmd - reference CommonMark implementations in C & JS,
   also contains latest spec & online demo.
2. http://talk.commonmark.org - CommonMark forum, good place to collaborate
   developpers efforts.


## Development / Modification

Parser consists of several responsibilities chains, filled with rules. You can
reconfigure anyone as you wish. Render also can be modified and extended. See
source code to understand details. Pay attention to this properties:

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

To prettify plugins init, `Remarked` has `.use()` helper for curried calls:

```js
var md = new Remarkable();

md.use(plugin1)
  .use(plugin2, opts)
  .use(plugin3);
```

## Authors

- Jon Schlinkert [github/jonschlinkert](https://github.com/jonschlinkert)
- Alex Kocharin [github/rlidwka](https://github.com/rlidwka)
- Vitaly Puzrin [github/puzrin](https://github.com/puzrin)


## License

[MIT](https://github.com/jonschlinkert/remarkable/blob/master/LICENSE)
