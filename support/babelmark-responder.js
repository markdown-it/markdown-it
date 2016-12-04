#!/usr/bin/env node

/* eslint-env es6 */
/* eslint-disable no-console */
'use strict';

const md  = require('../')('commonmark');
const app = require('express')();

const version = require('../package.json').version;

const banner = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>markdown-it responder for babelmark</title>
</head>
<body>
  <p><a href="https://github.com/markdown-it/markdown-it" target="_blank">markdown-it</a>
  responder for <a href="http://johnmacfarlane.net/babelmark2/" target="_blank">Babelmark2</a></p>
  <p>Usage: /?text=...</p>
</body>
</html>
`;

app.set('port', (process.env.PORT || 5000));

app.get('/', function (req, res) {
  if (typeof req.query.text === 'string') {
    res.json({
      name: 'markdown-it',
      html: md.render(req.query.text.slice(0, 1000)),
      version
    });
    return;
  }
  res.setHeader('Content-Type', 'text/html');
  res.send(banner);
});

app.listen(app.get('port'), function () {
  console.log(`Node app is running on port ${app.get('port')}`);
});
