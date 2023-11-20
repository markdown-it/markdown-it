import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

const markdownit = require('../../extra/lib/node_modules/markdown-it');

var md = markdownit('commonmark');

export function run(data) {
  return md.render(data);
}
