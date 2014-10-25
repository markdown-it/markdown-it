var Remarkable = require('remarkable');
var hljs       = require('highlight.js') // https://highlightjs.org/

var md = new Remarkable('full', {
  html:         false,        // Enable html tags in source
  xhtmlOut:     false,        // Use '/' to close single tags (<br />)
  breaks:       false,        // Convert '\n' in paragraphs into <br>
  langPrefix:   'language-',  // CSS language prefix for fenced blocks
  linkify:      true,         // autoconvert url-like texts to links
  typographer:  true,         // Enable smartypants and other sweet transforms

  // Highlighter function. Should return escaped html,
  // or '' if input not changed
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (__) {}
    }

    try {
      return hljs.highlightAuto(str).value;
    } catch (__) {}

    return ''; // use external default escaping
  }
});

console.log(md.render('# Remarkable rulezz!'));
// => <h1>Remarkable rulezz!</h1>
