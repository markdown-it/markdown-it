# markdown-it <!-- omit in toc -->

[![CI](https://github.com/markdown-it/markdown-it/actions/workflows/ci.yml/badge.svg)](https://github.com/markdown-it/markdown-it/actions/workflows/ci.yml)
[![NPM version](https://img.shields.io/npm/v/markdown-it.svg?style=flat)](https://www.npmjs.org/package/markdown-it)
[![Coverage Status](https://coveralls.io/repos/markdown-it/markdown-it/badge.svg?branch=master&service=github)](https://coveralls.io/github/markdown-it/markdown-it?branch=master)

> Markdown parser done right. Fast and easy to extend.

__[Live demo](https://markdown-it.github.io)__

- Follows the __[CommonMark spec](http://spec.commonmark.org/)__ + adds syntax extensions & sugar (URL autolinking, typographer).
- Configurable syntax! You can add new rules and even replace existing ones.
- High speed.
- [Safe](https://github.com/markdown-it/markdown-it/tree/master/docs/safety.md) by default.
- Community-written __[plugins](https://www.npmjs.org/browse/keyword/markdown-it-plugin)__ and [other packages](https://www.npmjs.org/browse/keyword/markdown-it) on npm.

__Table of content__

- [Install](#install)
- [Usage examples](#usage-examples)
- [API](#api)
- [Syntax extensions](#syntax-extensions)

## Install

**node.js**:

```bash
npm install markdown-it
```

> [!NOTE]
>
> For a quick look at `dist/` folder contents, see
> <https://unpkg.com/markdown-it/>.
>
> For browser you can use unpkg.com, esm.sh or any other CDN, wich mirror npm
> registry


## Usage examples

See also:

- __[API documentation](https://markdown-it.github.io/markdown-it/)__ - for more
  info and examples.
- [Development info](https://github.com/markdown-it/markdown-it/tree/master/docs) -
  for plugins writers.


**Simple** <!-- omit in toc -->

```js
// node.js
import MarkdownIt from 'markdown-it'
const md = new MarkdownIt()
const result = md.render('# markdown-it rulezz!');

// browser with UMD build, added to "window" on script load
// Note, there is no dash in "markdownit".
const md = new window.markdownit();
const result = md.render('# markdown-it rulezz!');
```

Single line rendering, without paragraph wrap:

```js
import MarkdownIt from 'markdown-it'
const md = new MarkdownIt()
const result = md.renderInline('__markdown-it__ rulezz!');
```


**Init with presets and options** <!-- omit in toc -->

(*) presets define combinations of active rules and options. Can be
`"commonmark"`, `"zero"` or `"default"` (if skipped). See
[API docs](https://markdown-it.github.io/markdown-it/classes/MarkdownIt.html#constructor.constructor) for more details.

```js
import MarkdownIt from 'markdown-it'

// commonmark mode
const md = new MarkdownIt('commonmark')

// default mode
const md = new MarkdownIt()

// enable everything
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
})
```

See [MarkdownItOptions](https://markdown-it.github.io/markdown-it/interfaces/MarkdownItOptions.html)
for the full options list.

**Plugins load** <!-- omit in toc -->

```js
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt()
  .use(plugin1)
  .use(plugin2, opts, ...)
  .use(plugin3);
```


**Syntax highlighting** <!-- omit in toc -->

Apply syntax highlighting to fenced code blocks with the `highlight` option:

```js
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js' // https://highlightjs.org

// Actual default values
const md = new MarkdownIt({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch (__) {}
    }

    return ''; // use external default escaping
  }
});
```

Or with full wrapper override (if you need assign class to `<pre>` or `<code>`):

```js
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js' // https://highlightjs.org

// Actual default values
const md = new MarkdownIt({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre><code class="hljs">${hljs.highlight(str,
          { language: lang, ignoreIllegals: true }).value}</code></pre>`;
      } catch (__) {}
    }

    return `<pre><code class="hljs">${md.utils.escapeHtml(str)}</code></pre>`;
  }
});
```

**Linkify** <!-- omit in toc -->

`linkify: true` uses [linkify-it](https://github.com/markdown-it/linkify-it). To
configure linkify-it, access the linkify instance through `md.linkify`:

```js
md.linkify.set({ fuzzyEmail: false });  // disables converting email to link
```


## API

__[API documentation](https://markdown-it.github.io/markdown-it/)__

If you are going to write plugins, please take a look at
[Development info](https://github.com/markdown-it/markdown-it/tree/master/docs).


## Syntax extensions

Embedded (enabled by default):

- [Tables](https://help.github.com/articles/organizing-information-with-tables/) (GFM)
- [Strikethrough](https://help.github.com/articles/basic-writing-and-formatting-syntax/#styling-text) (GFM)

Via plugins:

- [subscript](https://github.com/markdown-it/markdown-it-sub)
- [superscript](https://github.com/markdown-it/markdown-it-sup)
- [footnote](https://github.com/markdown-it/markdown-it-footnote)
- [definition list](https://github.com/markdown-it/markdown-it-deflist)
- [abbreviation](https://github.com/markdown-it/markdown-it-abbr)
- [emoji](https://github.com/markdown-it/markdown-it-emoji)
- [custom container](https://github.com/markdown-it/markdown-it-container)
- [insert](https://github.com/markdown-it/markdown-it-ins)
- [mark](https://github.com/markdown-it/markdown-it-mark)
- ... and [others](https://www.npmjs.org/browse/keyword/markdown-it-plugin)


**Manage rules** <!-- omit in toc -->

By default all rules are enabled, but can be restricted by options. On plugin
load all its rules are enabled automatically.

```js
import MarkdownIt from 'markdown-it'

// Activate/deactivate rules, with currying
const md = new MarkdownIt()
  .disable(['link', 'image'])
  .enable(['link'])
  .enable('image');

// Enable everything
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});
```

You can find all rules in sources:

- [`ParserCore`](https://github.com/markdown-it/markdown-it/blob/master/src/parser_core.ts)
- [`ParserBlock`](https://github.com/markdown-it/markdown-it/blob/master/src/parser_block.ts)
- [`ParserInline`](https://github.com/markdown-it/markdown-it/blob/master/src/parser_inline.ts)
