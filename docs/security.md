# Security

Many people don't understand that markdown format does not care much about
security. In many cases you have to pass output to sanitizers. `markdown-it`
provides 2 possible stategies to produce safe output:

1. Don't enable HTML. Extend markup features with [plugins](https://www.npmjs.org/browse/keyword/markdown-it-plugin). We think it's the best choice and use it by default.
   - That's ok for 99% of user needs.
   - Output will be safe without sanitizer.
2. Enable HTML and use external sanitizer package.

Also by default `markdown-it` prohibits some kind of links, which could be used
for XSS:

- `javascript:`, `vbscript:`
- `file:`
- `data:`, except some images (gif/png/jpeg/webp).

So, by default `markdown-it` should be safe. We care about it.

If you find a security problem - contact us via tracker or email. Such reports
are fixed with top priority.


## Plugins

Usually, plugins operate with tokenized content, and that's enougth to provide
safe output.

But there is one non-evident case you should know - don't allow plugins to
generate arbitrary element `id` and `name`. If those depend on user input -
always add prefixes to avoid DOM clobbering. See [discussion](https://github.com/markdown-it/markdown-it/issues/28) for details.

So, if you decide to use plugins that add extended class syntax or
autogenerating header anchors - be careful.
