---
title: Usage examples
category: Main
---

# Usage examples

## Simple

Node.js:

```js
import MarkdownIt from 'markdown-it'
const md = new MarkdownIt()
const result = md.render('# markdown-it rulezz!');
```

Browser with UMD build, added to `window` on script load:

```js
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


## Init with presets and options

(*) presets define combinations of active rules and options. Can be
`"commonmark"`, `"zero"` or `"default"` (if skipped). See
[API docs](https://markdown-it.github.io/markdown-it/classes/MarkdownIt.html#constructor.constructor) for more details.

CommonMark mode:

```js
import MarkdownIt from 'markdown-it'
const md = new MarkdownIt('commonmark')
```

Default mode:

```js
import MarkdownIt from 'markdown-it'
const md = new MarkdownIt()
```

Enable everything:

```js
import MarkdownIt from 'markdown-it'
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
})
```

See [MarkdownItOptions](https://markdown-it.github.io/markdown-it/interfaces/MarkdownItOptions.html)
for the full options list.


## Plugins load

```js
import MarkdownIt from 'markdown-it'
import markdownItAbbr from 'markdown-it-abbr'
import markdownItContainer from 'markdown-it-container'
import markdownItFootnote from 'markdown-it-footnote'

const md = new MarkdownIt()
  .use(markdownItAbbr)
  .use(markdownItContainer, 'warning')
  .use(markdownItFootnote)
```


## Syntax highlighting

Apply syntax highlighting to fenced code blocks with the `highlight` option:

```js
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js' // https://highlightjs.org

const md = new MarkdownIt({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value
      } catch (__) {}
    }

    return '' // use external default escaping
  }
});
```

Or with full wrapper override (if you need assign class to `<pre>` or `<code>`):

```js
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js' // https://highlightjs.org

const md = new MarkdownIt({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre><code class="hljs">${hljs.highlight(str,
          { language: lang, ignoreIllegals: true }).value}</code></pre>`
      } catch (__) {}
    }

    return `<pre><code class="hljs">${md.utils.escapeHtml(str)}</code></pre>`
  }
});
```


## Linkify

`linkify: true` uses [linkify-it](https://github.com/markdown-it/linkify-it). To
configure linkify-it, access the linkify instance through `md.linkify`:

```js
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({ linkify: true })
md.linkify.set({ fuzzyEmail: false }) // disables converting email to link
```
