cooming soon

remarkable
==========

[![Build Status](https://travis-ci.org/jonschlinkert/remarkable.svg?branch=master)](https://travis-ci.org/jonschlinkert/remarkable)
[![NPM version](https://img.shields.io/npm/v/remarkable.svg)](https://www.npmjs.org/package/remarkable)

Markdown parser done right. Fast and easy to extend.

/DEMO LINK/

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
var Remarkable = require('remarkable')();
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

