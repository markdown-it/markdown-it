# Adding or modifying rules
## Default renderer rules
Rules on how to translate markdown content to HTML elements are stored in `renderer.rules`:

```js
const MarkdownIt = require('markdown-it');
const md = new MarkdownIt();

console.log(Object.keys(md.renderer.rules))
```
Output:
```js
[
  'code_inline',
  'code_block',
  'fence',
  'image',
  'hardbreak',
  'softbreak',
  'text',
  'html_block',
  'html_inline'
]
```
These are the default renderer rules. For any element that is not explicitly listed in this array its default rule applies. For example the rule `bullet_list_open` is not defined, so when markdown-it tries to parse a list to HTML it defaults to ua generic renderer called `Renderer.prototype.renderToken`.

## The demo tool

You can use the [demo tool](https://markdown-it.github.io/) to see which specific rule name corresponds to which HTML tag (switch to the debug tab in the output).

Let's use a Hello World example:
  [Link to Demo](https://markdown-it.github.io/#md3=%7B%22source%22%3A%22-%20Hello%20World%22%2C%22defaults%22%3A%7B%22html%22%3Afalse%2C%22xhtmlOut%22%3Afalse%2C%22breaks%22%3Afalse%2C%22langPrefix%22%3A%22language-%22%2C%22linkify%22%3Afalse%2C%22typographer%22%3Afalse%2C%22_highlight%22%3Afalse%2C%22_strict%22%3Afalse%2C%22_view%22%3A%22debug%22%7D%7D)

Now take a closer look at the first element in the resulting list:
```js
{
    "type": "bullet_list_open",
    "tag": "ul",
    "attrs": null,
    "map": [
      0,
      1
    ],
    "nesting": 1,
    "level": 0,
    "children": null,
    "content": "",
    "markup": "-",
    "info": "",
    "meta": null,
    "block": true,
    "hidden": false
  }
```
This is a [Token](https://markdown-it.github.io/markdown-it/#Token). Its corresponding HTML `tag` is `ul` and its nesting is `1`. This means this specific token represents the opening tag of the HTML list we want to generate from markdown.

* `{ nesting: 1}` is an opening tag: `<ul>`
* `{ nesting: -1}` is a closing tag: `</ul>`
* `{ nesting: 0}` is a self-closing tag: `<br />`

## Adding new rules
### To add a default CSS class to an element

Let's set ourself a goal: 
```
Create a rule to add the CSS class "lorem_ipsum" to every <ul>
```

Rules are functions that accept a number of parameters:
```js
const MarkdownIt = require('markdown-it');
const md = new MarkdownIt();

md.renderer.rules.bullet_list_open = function(tokens, idx, options, env, self) {
   // tokes: List of all tokens being parsed
   // idx: Number that corresponds to the key of the current token in tokens
   // options: The options defined when creating the new markdown-it object ({} in our case)
   // env ???
   // self: A reference to the renderer itself
};
```
We assign the new rule to the key that corresponds to the html tag we want to modify.

#### Reusing existing rules

It is good practice however to save the default renderer for your element and only make minimal chances to the rules in place, instead of reinventing the wheel:

```js
const MarkdownIt = require('markdown-it');
const md = new MarkdownIt();

const proxy = (tokens, idx, options, env, self) => self.renderToken(tokens, idx, options);
const defaultBulletListOpenRenderer = md.renderer.rules.bullet_list_open || proxy;

md.renderer.rules.bullet_list_open = function(tokens, idx, options, env, self) {
   // Make your changes here ...
   // ... then render it using the existing logic
   return defaultBulletListOpenRenderer(tokens, idx, options, env, self)
};
```
Earlier we noticed that `renderer.rules.bullet_list_open` is undefined by default. So `proxy` is the most basic rule to render a token and is used if the specific rule is undefined.

CSS classes are attributes on HTML elements. If we think back to the object representation of the `ul` element we looked at, we might remember that it contained an `attrs` key with the value `null`. This means this token had no attributes. `attrs` can be an array of `[key, value]` pairs which describe attributes to be added to the token.

Looking at [the API documention for Token objects](https://markdown-it.github.io/markdown-it/#Token.attrJoin) we find the `attrJoin` method. This method allows us to join an existing attributes value with a new value or create the attribute if it doens't exist yet. Simply pushing the value (for example with `token.attr.push(["key", "value"]`) would overwrite any previous change:

```js
const MarkdownIt = require('markdown-it');
const md = new MarkdownIt();

const proxy = (tokens, idx, options, env, self) => self.renderToken(tokens, idx, options);
const defaultBulletListOpenRenderer = md.renderer.rules.bullet_list_open || proxy;

md.renderer.rules.bullet_list_open = function(tokens, idx, options, env, self) {
   // Make your changes here ...
   tokens[idx].attrJoin("class", "lorem_ipsum")
   // ... then render it using the existing logic
   return defaultBulletListOpenRenderer(tokens, idx, options, env, self)
};
```
Let's test the finished rule:
```js
const MarkdownIt = require('markdown-it');
const md = new MarkdownIt();

const proxy = (tokens, idx, options, env, self) => self.renderToken(tokens, idx, options);
const defaultBulletListOpenRenderer = md.renderer.rules.bullet_list_open || proxy;

md.renderer.rules.bullet_list_open = function(tokens, idx, options, env, self) {
   // Make your changes here ...
   tokens[idx].attrJoin("class", "lorem_ipsum");
   // ... then render it using the existing logic
   return defaultBulletListOpenRenderer(tokens, idx, options, env, self)
};

console.log(md.render("- Hello World"));
```
Output: 
```html
<ul class="lorem_ipsum">
<li>Hello World</li>
</ul>
```
### To add a wrapper element
Let's imagine we are using CSS pseudo classes such as `:before` and `:after` to style our list because using `list-style-type` doesn't provide the bullet types we want and `list-style-image` isn't flexible enough to position itself properly across all major browsers.

To keep a proper line wrapping in our list we have set all elements in our `li` to display as a block (`li * {display: block;}`). This works for our pseudo classes and other `HTMLElements`. However, it does not work for `TextNodes`. So having this output will produce weird line indents:
```html
<ul>
  <li>Hello World</li>
<ul>
```

To fix this we can use a wrapper element which can be properly displayed as a block:

```html
<ul>
  <li>
    <span>Hello World</span>
  </li>
<ul>
```

So our next goal is:
```
Add a rule that wraps the content of every <li> in a <span>
```

Keen observers might have already noticed that rules return their HTML tags as strings. So this modification is rather straight forward.

Let's use the [demo tool](https://markdown-it.github.io/#md3=%7B%22source%22%3A%22-%20Hello%20World%22%2C%22defaults%22%3A%7B%22html%22%3Afalse%2C%22xhtmlOut%22%3Afalse%2C%22breaks%22%3Afalse%2C%22langPrefix%22%3A%22language-%22%2C%22linkify%22%3Afalse%2C%22typographer%22%3Afalse%2C%22_highlight%22%3Afalse%2C%22_strict%22%3Afalse%2C%22_view%22%3A%22debug%22%7D%7D) again and check which keys we need to add in the `renderer.rules` object to access the opening and closing tags of an `li` element:

```
list_item_open
list_item_close
```

Now use this information to add the new rules:

```js
const MarkdownIt = require('markdown-it');
const md = new MarkdownIt();

const proxy = (tokens, idx, options, env, self) => self.renderToken(tokens, idx, options);
const defaultListItemOpenRenderer = md.renderer.rules.list_item_open || proxy;

md.renderer.rules.list_item_open = function(tokens, idx, options, env, self) {
  return `${defaultListItemOpenRenderer(tokens, idx, options, env, self)}<span>`;
};

const defaultListItemCloseRenderer = md.renderer.rules.list_item_close || proxy;

md.renderer.rules.list_item_close = function(tokens, idx, options, env, self) {
  return `</span>${defaultListItemCloseRenderer(tokens, idx, options, env, self)}`;
};
```
Testing our modification:

```js
const MarkdownIt = require('markdown-it');
const md = new MarkdownIt();

const proxy = (tokens, idx, options, env, self) => self.renderToken(tokens, idx, options);
const defaultListItemOpenRenderer = md.renderer.rules.list_item_open || proxy;

md.renderer.rules.list_item_open = function(tokens, idx, options, env, self) {
  return `${defaultListItemOpenRenderer(tokens, idx, options, env, self)}<span>`;
};

const defaultListItemCloseRenderer = md.renderer.rules.list_item_close || proxy;

md.renderer.rules.list_item_close = function(tokens, idx, options, env, self) {
  return `</span>${defaultListItemCloseRenderer(tokens, idx, options, env, self)}`;
};

console.log(md.render("- Hello World"));
```
Output:
```html
<ul>
  <li>
    <span>Hello World</span>
  </li>
</ul>
```

Of course using string manipulation might get really messy for bigger changes. So consider using `markdown-it`s Token class instead:
```js
const MarkdownIt = require('markdown-it');
const Token = require('markdown-it/lib/token');
const md = new MarkdownIt();

const proxy = (tokens, idx, options, env, self) => self.renderToken(tokens, idx, options);

const defaultListItemOpenRenderer = md.renderer.rules.list_item_open || proxy;
const defaultSpanOpenRenderer = md.renderer.rules.span_open || proxy;

md.renderer.rules.list_item_open = function(tokens, idx, options, env, self) {
    const span = new Token("span_open", "span", 1);
    return `${defaultListItemOpenRenderer(tokens, idx, options, env, self)}${defaultSpanOpenRenderer([span], 0, options, env, self)}`;
};

const defaultListItemCloseRenderer = md.renderer.rules.list_item_close || proxy;
const defaultSpanCloseRenderer = md.renderer.rules.span_close|| proxy;

md.renderer.rules.list_item_close = function(tokens, idx, options, env, self) {
    const span = new Token("span_close", "span", -1);
    return `${defaultSpanCloseRenderer([span], 0, options, env, self)}${defaultListItemCloseRenderer(tokens, idx, options, env, self)}`;
};

console.log(md.render("- Hello World"));
```

Output:

```html
<ul>
  <li>
    <span>Hello World<span>
  </li>
</ul>
```
