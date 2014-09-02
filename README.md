cooming soon

remarkable
==========

[![Build Status](https://travis-ci.org/jonschlinkert/remarkable.svg?branch=master)](https://travis-ci.org/jonschlinkert/remarkable)
[![NPM version](https://img.shields.io/npm/v/remarkable.svg)](https://www.npmjs.org/package/remarkable)

Markdown parser done right. Fast and easy to extend.

[Live demo](http://jonschlinkert.github.io/remarkable/demo/)

/INTRO/


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
var Remarkable = require('remarkable')();
var md = new Remarkable(/* options */);

console.log(md.parse('# Remarkable rulezz!'));
//=> <h1># Remarkable rulezz!</h1>
```

You can define options via `set` method:

```javascript
var Remarkable = require('remarkable');
var md = new Remarkable();

md.set({
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false
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