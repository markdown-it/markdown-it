# Development recommendations

Before continuing, make sure you've read:

1. [README](https://github.com/markdown-it/markdown-it#markdown-it)
2. [API documentation](https://markdown-it.github.io/markdown-it/)
3. [Architecture description](architecture.md)


## General considerations for plugins.

1. Try to find the right place for your plugin rule:
  - Will it conflict with existing markup (by priority)?
    - If yes - you need to write an inline or block rule.
    - If no - you can morph tokens within core chains.
  - Remember that token morphing in core chains is always more simple than writing
    block or inline rules, if you don't copy existing ones. However,
    block and inline rules are usually faster.
  - Sometimes, it's enough to only modify the renderer, for example, to add
    header IDs or `target="_blank"` for the links.
  - Plugins should not require the `markdown-it` package as dependency in `package.json`.
    If you need access to internals, those are available via a parser instance,
    passed on plugin load. See properties of main class and nested objects.
2. Search existing
   [plugins](https://www.npmjs.org/browse/keyword/markdown-it-plugin)
   or [rules](https://github.com/markdown-it/markdown-it/tree/master/lib),
   doing something similar. It can be more simple to modify existing code,
   instead of writing all from scratch.
3. If you did all steps above, but still has questions - ask in
   [tracker](https://github.com/markdown-it/markdown-it/issues). But, please:
   - Be specific. Generic questions like "how to do plugins" and
     "how to learn programming" are not accepted.
   - Don't ask us to break [CommonMark](http://commonmark.org/) specification.
     Such things should be discussed first on [CommonMark forum](http://talk.commonmark.org/).


## Notes for NPM packages

To simplify search:

- add to `package.json` keywords `markdown-it` and `markdown-it-plugin` for plugins.
- add keyword `markdown-it` for any other related packages.


## FAQ


#### I need async rule, how to do it?

Sorry. You can't do it directly. All complex parsers are sync by nature. But you
can use workarounds:

1. On parse phase, replace content by random number and store it in `env`.
2. Do async processing over collected data.
3. Render content and replace those random numbers with text; or replace first, then render.

Alternatively, you can render HTML, then parse it to DOM, or
[cheerio](https://github.com/cheeriojs/cheerio) AST, and apply transformations
in a more convenient way.


#### How to replace part of text token with link?

The right sequence is to split text to several tokens and add link tokens in between.
The result will be: `text` + `link_open` + `text` + `link_close` + `text`.

See implementations of [linkify](https://github.com/markdown-it/markdown-it/blob/master/lib/rules_core/linkify.js) and [emoji](https://github.com/markdown-it/markdown-it-emoji/blob/master/lib/replace.js) - those do text token splits.

__Note.__ Don't try to replace text with HTML markup! That's not secure.


#### Why my inline rule is not executed?

The inline parser skips pieces of texts to optimize speed. It stops only on [a small set of chars](https://github.com/markdown-it/markdown-it/blob/master/lib/rules_inline/text.js), which can be tokens. We did not made this list extensible for performance reasons too.

If you are absolutely sure that something important is missing there - create a
ticket and we will consider adding it as a new charcode.


#### Why do you reject some useful things?

We do a markdown parser. It should keep the "markdown spirit". Other things should
be kept separate, in plugins, for example. We have no clear criteria, sorry.
Probably, you will find [CommonMark forum](http://talk.commonmark.org/) a useful read to understand us better.

Of course, if you find the architecture of this parser interesting for another type
of markup, you are welcome to reuse it in another project.
