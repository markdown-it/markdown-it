// Simple typographyc replacements
//
'use strict';


var COPY_RE = /\((c|tm|r|p)\)/i;
var RARE_RE = /\+-|\.\.|\?\?\?\?|!!!!|,,|--/;

module.exports = function replace(t, state) {
  var i, token, text,
      tokens = state.tokens,
      options = t.options;

  for (i = tokens.length - 1; i >= 0; i--) {
    token = tokens[i];
    if (token.type === 'text') {
      text = token.content;

      if (COPY_RE.test(text)) {
        if (options.copyright) {
          text = text.replace(/\(c\)/gi, '©');
        }
        if (options.trademark) {
          text = text.replace(/\(tm\)/gi, '™');
        }
        if (options.registered) {
          text = text.replace(/\(r\)/gi, '®');
        }
        if (options.paragraph) {
          text = text.replace(/\(p\)/gi, '§');
        }
      }

      if (RARE_RE.test(text)) {
        if (options.plusminus) {
          text = text.replace(/\+-/g, '±');
        }
        if (options.ellipsis) {
          // .., ..., ....... -> …
          // but ?..... & !..... -> ?.. & !..
          text = text.replace(/\.{2,}/g, '…').replace(/([?!])…/g, '$1..');
        }
        if (options.dupes) {
          text = text.replace(/([?!]){4,}/g, '$1$1$1').replace(/,{2,}/g, ',');
        }
        if (options.dashes) {
          text = text
                  // em-dash
                  .replace(/(^|[^-])---([^-]|$)/mg, '$1\u2014$2')
                  // en-dash
                  .replace(/(^|\s)--(\s|$)/mg, '$1\u2013$2')
                  .replace(/(^|[^-\s])--([^-\s]|$)/mg, '$1\u2013$2');
        }
      }

      token.content = text;
    }
  }
};
