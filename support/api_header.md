<!-- styles hack until ndoc updated -->
<style>
header .name_prefix { font-weight: normal; }
</style>

# markdown-it API

### Simple use

In most cases you will use `markdown-it` in very simple way:

```javascript
var md = require('markdown-it')();

var result = md.render('your_markdown_string');

// Or for inline (without paragraths & blocks)
var resultInline = md.renderInline('your_markdown_inline_string');
```

### Advanced use

Advanced use consist of this steps:

1. Create instance with desired preset & options.
2. Add plugins.
3. Enable/Disable additional rules.
4. Rewrite renderer functions.
5. Use result to call `.render()` or `.renderInline()` method.

Of cause, you can skip not needed steps, or change sequense.


__Example 1.__ Minimalistic mode with bold, italic and line breaks:

```javascript
var md = require('markdown-it')('zero', { breaks: true })
            .enable([ 'newline', 'emphasis' ]);

var result = md.renderInline(...);
```


__Example 2.__ Load plugin and disable tables:

```javascript
var md = require('markdown-it')()
            .use(require('markdown-it-emoji'))
            .disable('table');

var result = md.render(...);
```


__Example 3.__ Replace `<strong>` with `<b>` in rendered result:

```javascript
var md = require('markdown-it')();

md.renderer.rules.strong_open  = function () { return '<b>'; };
md.renderer.rules.strong_close = function () { return '</b>'; };

var result = md.renderInline(...);
```


See classes doc for all available features and more examples.
