var Remarkable = require('remarkable');

var md = new Remarkable({
  html: true,
  xhtml: true,
  breaks: false,
  langprefix: 'language-'
});

console.log(md.parse('# Remarkable rulezz!'));
// => <h1>Remarkable rulezz!</h1>
