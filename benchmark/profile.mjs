#!/usr/bin/env node
/*eslint no-console:0*/

import { readFileSync } from 'fs';
import markdownit from '../index.mjs';

var md = markdownit({
  html: true,
  linkify: false,
  typographer: false
});

var data = readFileSync(new URL('../test/fixtures/commonmark/spec.txt', import.meta.url), 'utf8');

for (var i = 0; i < 20; i++) {
  md.render(data);
}
