cooming soon

remarkable
==========

[![Build Status](https://travis-ci.org/jonschlinkert/remarkable.svg?branch=master)](https://travis-ci.org/jonschlinkert/remarkable)
[![NPM version](https://img.shields.io/npm/v/remarkable.svg)](https://www.npmjs.org/package/remarkable)

Markdown parser done right. Fast and easy to extend.

__[Live demo](http://jonschlinkert.github.io/remarkable/demo/)__


Install
-------

node.js:

```bash
npm install remarkable --save
```

bower:

```bash
bower install remarkable --save
```


Usage
-----

```javascript
var Remarkable = require('remarkable');
var md = new Remarkable({
  html: false,              // enable html tags in source
  xhtml: false,             // use '/' to close single tags (<br />)
  breaks: true,             // convert '\n' in paragraphs into <br>
  langprefix: 'language-',  // css language prefix for fenced blocks

  // Should return HTML markup for highlighted text,
  // or empty string to escape source
  highlight: function (str, lang) { return ''; }
});

console.log(md.parse('# Remarkable rulezz!'));
//=> <h1># Remarkable rulezz!</h1>
```

You can define options via `set` method:

```javascript
var Remarkable = require('remarkable');
var md = new Remarkable();

md.set({
  html: false,
  breaks: true
});
```


Authors
-------

- Jon Schlinkert [github/jonschlinkert](https://github.com/jonschlinkert)
- Alex Kocharin [github/rlidwka](https://github.com/rlidwka)
- Vitaly Puzrin [github/puzrin](https://github.com/puzrin)


License
-------

[MIT](https://github.com/jonschlinkert/remarkable/blob/master/LICENSE)