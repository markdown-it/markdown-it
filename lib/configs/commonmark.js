// Commonmark default options

'use strict';


module.exports = {
  options: {
    html:         true,         // Enable HTML tags in source
    xhtmlOut:     true,         // Use '/' to close single tags (<br />)
    breaks:       false,        // Convert '\n' in paragraphs into <br>
    langPrefix:   'language-',  // CSS language prefix for fenced blocks
    linkify:      false,        // autoconvert URL-like texts to links
    typographer:  false,        // Enable smartypants and other sweet transforms

    // Highlighter function. Should return escaped HTML,
    // or '' if input not changed
    highlight: function (/*str, , lang*/) { return ''; },

    maxNesting:   20            // Internal protection, recursion limit
  },

  components: {

    block: {
      rules: [
        'blockquote',
        'code',
        'fences',
        'heading',
        'hr',
        'htmlblock',
        'lheading',
        'list',
        'paragraph'
      ]
    },

    inline: {
      rules: [
        'autolink',
        'backticks',
        'emphasis',
        'entity',
        'escape',
        'htmltag',
        'links',
        'newline',
        'text'
      ]
    },

    typographer: {
      options: {
        singleQuotes: '‘’', // set empty to disable
        doubleQuotes: '“”', // set '«»' for Russian, '„“' for German, empty to disable
        copyright:    true, // (c) (C) → ©
        trademark:    true, // (tm) (TM) → ™
        registered:   true, // (r) (R) → ®
        plusminus:    true, // +- → ±
        paragraph:    true, // (p) (P) → §
        ellipsis:     true, // ... → …
        dupes:        true, // ???????? → ???, !!!!! → !!!, `,,` → `,`
        dashes:       true  // -- → —
      }
    }
  }
};
