import markdownit from '../../../index.mjs';

var md = markdownit({
  html: true,
  linkify: true,
  typographer: true
});

export function run(data) {
  return md.render(data);
}
