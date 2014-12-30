# markdown-it design principles

## Data flow

Input data is piped via nestesd chains of rules. There are 3 nested chains -
`core`, `block` & `inline`:

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
Difference is simple:

- Tokens are sequence (Array).
- Opening and closing tags are separate tokens.
- There are special token object, "inline containers", having nested token
  sequences with inline markup (bold, italic, text, ...).

Each token has common fields:

- __type__ - token name.
- __level__ - nesting level, useful to seek closeing pair.
- __lines__ - [begin, end], for block tokens only. Range of input lines,
  compiled to this token.

Inline container (`type === "inline"`) has additional properties:

- __content__ - raw text, unparsed inline content.
- __children__ - token stream for parsed content.

In total, token stream is:

- On the top level - array of paired or single "block" tokens:
  - open/close for headers, lists, blockquotes, paragraphs, ...
  - codes, fenced blocks, horisontal rules, html blocks, inlines containers
- Each inline containers have `.children` property with token stream for inline content:
  - open/close for strong, em, link, code, ...
  - text, line breaks

Why not AST? Because it's not needed for our tasks. We follow KISS principle.
If you whish - you can call parser without renderer and convert token stream
to AST.

Where to search more details about tokens:

- [Renderer source](https://github.com/markdown-it/markdown-it/blob/master/lib/renderer.js)
- [Live demo](https://markdown-it.github.io/) - type your text ant click `debug` tab.


## Rules

Rules are functions, doing "magick" with parser `state` objects. Each rule is
registered in one of chain with unique name.

Rules are managed by names via [Ruler](https://markdown-it.github.io/markdown-it/#Ruler) instances and `enable` / `disable` methods in [MarkdownIt](https://markdown-it.github.io/markdown-it/#MarkdownIt).

You can note, that some rules have "validation mode" - in this mode rule does not
modify token stream, and only search end of token. It's one of important design principle - token stream is "write only" on block & inline parse stages.

Parser is designed to keep rules independent. You can safely disable any, or
add new one. There are no universal recipes how to create new rules - design of
distributed state machines with good data isolation is tricky business. But you
can investigate existing rules & plugins to see possible approaches.

Also, in complex cases you can try to ask for help in tracker. Condition is very
simple - it should be clear from your ticket, that you studied docs, sources,
and tryed to do something yourself. We never reject with help to real developpers.


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
