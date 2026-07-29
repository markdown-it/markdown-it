---
title: Syntax plugins
category: Main
---

# Syntax plugins

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


## Manage rules

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
