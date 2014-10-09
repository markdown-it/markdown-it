// Commonmark default options

'use strict';


module.exports = {
  html:         true,         // Enable html tags in source
  xhtmlOut:     true,         // Use '/' to close single tags (<br />)
  breaks:       false,        // Convert '\n' in paragraphs into <br>
  langPrefix:   'language-',  // CSS language prefix for fenced blocks
  linkify:      false,        // autoconvert url-like texts to links
  typographer:  false,        // Enable smartypants and other sweet transforms

  // Highlighter function. Should return escaped html,
  // or '' if input not changed
  highlight: function (/*str, , lang*/) { return ''; },

  maxNesting:   20            // Internal protection, recursion limit
};
