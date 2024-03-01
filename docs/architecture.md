# markdown-it design principles

## Data flow

Input data is parsed via nested chains of rules. There are 3 nested chains --
`core`, `block`, & `inline`:

```
core
    core.rule1 (normalize)
    ...
    core.ruleX

    block
        block.rule1 (blockquote)
        ...
        block.ruleX

    core.ruleX1 (intermediate rule that applies on block tokens, nothing yet)
    ...
    core.ruleXX

    inline (applied to each block token with "inline" type)
        inline.rule1 (text)
        ...
        inline.ruleX

    core.ruleYY (applies to all tokens)
    ... (abbreviation, footnote, typographer, linkifier)
```

The result of parsing is a token stream that will be passed to the renderer to generate HTML content.

These tokens can themselves be parsed again to generate more tokens (ex: a `list` token can be divided into multiple `inline` tokens).

An `env` object can be used alongside tokens to inject external variables into your parsers and renderers.

Each chain (`core`, `block`, & `inline`) uses an independent `state` object when parsing data so that each parsing operation is independent and can be disabled on the fly.


## Token stream

Instead of a traditional AST, we use more low-level data representation -- *tokens*.
The difference is simple:

- Tokens are a simple sequence (an array).
- Opening and closing tags are separate.
- There are special token objects, "inline containers", that have nested tokens.
  These are sequences with inline markup, such as bold, italic, text, etc.

See the [`Token`](https://github.com/markdown-it/markdown-it/blob/master/lib/token.mjs) class
for details about each token's content.

In total, a token stream is:

- On the top level -- an array of paired or single "block" tokens:
  - open/close for headers, lists, blockquotes, paragraphs, etc.
  - code blocks, fenced blocks, horizontal rules, HTML blocks, inline containers
- Each inline token has a `children` property with a nested token stream for inline content:
  - open/close for bold, italic, links, inline code, etc.
  - text, line breaks

Why not an AST? It's not needed for our tasks. We follow the KISS principle.
If you wish, you can call a parser without a renderer and convert the token stream
into an AST.

More details about tokens:

- [`Renderer` source](https://github.com/markdown-it/markdown-it/blob/master/lib/renderer.mjs)
- [`Token` source](https://github.com/markdown-it/markdown-it/blob/master/lib/token.mjs)
- [Live demo](https://markdown-it.github.io/) - type your text and click the `debug` tab.


## Rules

Rules are functions, doing "magic" with parser `state` objects. A rule is associated with one or more *chains* and is unique. For instance, a `blockquote` token is associated with the `blockquote`, `paragraph`, `heading`, and `list` chains.

Rules are managed by name via [`Ruler`](https://markdown-it.github.io/markdown-it/#Ruler) instances and can be enabled and disabled from [`MarkdownIt`](https://markdown-it.github.io/markdown-it/#MarkdownIt)'s methods.

Note that some rules have a `validation mode` -- in this mode, rules do not
modify the token stream and only look ahead for the end of a token. It's one
important design principle -- a token stream is "write only" on the `block` & `inline` parse stages.

Parsers are designed to keep rules independent of each other. You can safely enable/disable them or
add new ones. There are no universal recipes for how to create new rules -- the design of
distributed state machines with good data isolation is a tricky business. However, you
can investigate existing rules & plugins to see possible approaches.

In complex cases you can try to ask for help in the [issue tracker](https://github.com/markdown-it/markdown-it/issues).
The condition is very simple -- it should be clear from your ticket that you studied the docs, sources,
and tried to do something yourself. We never reject with help to real developers.


## Renderer

After the token stream is generated, it's passed to a [`Renderer`](https://markdown-it.github.io/markdown-it/#Renderer).
It then iterates through all the tokens, passing each to a rule with the same name as its token type.

Renderer rules are located in `md.renderer.rules[name]` and are simple functions
with the same signature:

```js
function (tokens, idx, options, env, renderer) {
  // ...
  return htmlResult;
}
```

In many cases, that allows easy output changes even without parser intrusion.
For example, let's convert every image that uses a Vimeo link into a player iframe:

```js
var md = require('markdown-it')();

var defaultRender = md.renderer.rules.image,
    vimeoRE       = /^https?:\/\/(www\.)?vimeo.com\/(\d+)($|\/)/;

md.renderer.rules.image = function (tokens, idx, options, env, self) {
  var src = tokens[idx].attrGet('src');

  if (vimeoRE.test(src)) {
    var id = src.match(vimeoRE)[2];

    return '<div class="embed-responsive embed-responsive-16by9">\n' +
           '  <iframe class="embed-responsive-item" src="//player.vimeo.com/video/' + id + '"></iframe>\n' +
           '</div>\n';
  }

  // Pass the token to the default renderer.
  return defaultRender(tokens, idx, options, env, self);
};
```

Here is another example on how to add `target="_blank"` to all links:

```js
// Remember the old renderer if overridden, or proxy to the default renderer.
var defaultRender = md.renderer.rules.link_open || function (tokens, idx, options, env, self) {
  return self.renderToken(tokens, idx, options);
};

md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
  // Add a new `target` attribute, or replace the value of the existing one.
  tokens[idx].attrSet('target', '_blank');

  // Pass the token to the default renderer.
  return defaultRender(tokens, idx, options, env, self);
};
```

Note that if you need to add attributes, you can do so without a renderer override.
For example, you can update tokens in the `core` chain. This is slower than a direct
renderer override, but it can be more simple. Let's use the
[`markdown-it-for-inline`](https://github.com/markdown-it/markdown-it-for-inline) plugin
to do the same thing as in previous example:

```js
var iterator = require('markdown-it-for-inline');

var md = require('markdown-it')()
            .use(iterator, 'url_new_win', 'link_open', function (tokens, idx) {
              tokens[idx].attrSet('target', '_blank');
            });
```

You also can write your own renderer to generate formats other than HTML, such as
JSON and XML. You can even use it to generate an AST.


## Summary

This was mentioned in [Data flow](#data-flow), but let's repeat the sequence again:

1. Blocks are parsed, and the top level of each token stream is filled with block tokens.
2. Content in inline containers is parsed, filling their `children` properties.
3. Rendering happens.

And somewhere in between, you can apply additional transformations.

Source code for each chain can be seen in the following files:

- [`parser_core.mjs`](https://github.com/markdown-it/markdown-it/blob/master/lib/parser_core.mjs)
- [`parser_block.mjs`](https://github.com/markdown-it/markdown-it/blob/master/lib/parser_block.mjs)
- [`parser_inline.mjs`](https://github.com/markdown-it/markdown-it/blob/master/lib/parser_inline.mjs)

Also, you can change output directly in a [`Renderer`](https://markdown-it.github.io/markdown-it/#Renderer) for many simple cases.
