var Remarkable = require('remarkable');
var md = new Remarkable({
  html: false,              // enable html tags in source
  xhtml: false,             // use '/' to close single tags (<br />)
  breaks: true,             // convert '\n' in paragraphs into <br>
  langPrefix: 'language-',  // css language prefix for fenced blocks

  // Should return HTML markup for highlighted text,
  // or empty string to escape source
  highlight: function (str, lang) { return ''; }
});

console.log(md.parse('# Remarkable rulezz!'));
// => <h1>Remarkable rulezz!</h1>
