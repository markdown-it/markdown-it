# markdown-it design principles

## Data flow

Parse process is unified as much as possible. Input data is piped via nestesd
chains of rules. There are 3 "main" chains (core / block / inline):

```
core
    core.rule1
    ... (none yet, you can patch input string here)

    block
        block.rule1
        ...
        block.ruleX

    core.ruleXX
    ... (references, abbreviations, footnotes)

    inline (applyed to each block token with "inline type")
        inline.rule1
        ...
        inline.ruleX

    core.ruleYY
    ... (typographer, linkifier)

```

Mutable data are:

- array of tokens
- `env` sandbox

Tokens are the "main" data, but some rules can be "splitted" to several chains,
and need sandbox for exchange. Also, `env` can be used to inject per-render
variables for your custom parse and render rules.

Each chain (core / block / inline) has independent `state` object, to isolate
data and protect code from clutter.


## Token stream

Instead of traditional AST we use more low-level data representation - tokens.
Difference is very simple.

- tokens are sequence (Array)
- opening and closing tags are separate tokens
- there are special token object, "inline containers", having nested token
  sequences with inline markup (bold, italic, text)

Each token has 2 mandatory fields:

- __type__ - token name.
- __level__ - nesting level, useful to seek matched pair.
- __lines__ - [begin, end], for block tokens only. Range of input lines,
  compiled to this token

Inline container (`type === "inline"`) has additional properties:

- __content__ - raw text, unparsed inline content.
- __children__ - token stream for parsed content.

See [renderer source](https://github.com/markdown-it/markdown-it/blob/master/lib/renderer.js)
for available tokens and those properties. Currently there are no special
requirements on tokens naming and additional fields.

In total, token stream is:

- Array of paired or single "block" tokens, on top level:
  - open/close for headers, lists, blockquotes paragraphs
  - codes, fenced blocks, horisontal rules, html blocks, inlines containers
- Inline containers have "substream" Array with inline tags:
  - open/close for strong, em, link, code, ...
  - text, line breaks

Why not AST? Because it's not needed for our tasks. We follow KISS principle.
If you whish - you can call parser withour renderer and convert token stream
to AST.

## Parse process

This was mentioned in [Data flow](#data-flow), but let's repeat sequence again:

1. Blocks are parsed, and top level of token stream filled with block tokens.
2. Content on inline containers is parsed, filling `.children` properties.
3. Rendering happens.

And somewhere between you can apply addtional transformations :) . Full content
of each chain can be seen on the top of
[parser_core.js](https://github.com/markdown-it/markdown-it/blob/master/lib/parser_core.js),
[parser_block.js](https://github.com/markdown-it/markdown-it/blob/master/lib/parser_block.js) and
[parser_inline.js](https://github.com/markdown-it/markdown-it/blob/master/lib/parser_inline.js)
files.
