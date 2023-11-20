import { fileURLToPath } from 'node:url';
import generate from 'markdown-it-testgen';
import markdownit from '../index.mjs';


describe('markdown-it', function () {
  var md = markdownit({
    html: true,
    langPrefix: '',
    typographer: true,
    linkify: true
  });

  generate(fileURLToPath(new URL('fixtures/markdown-it', import.meta.url)), md);
});
