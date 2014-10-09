// Simple typographyc replacements
//
'use strict';


module.exports = function replace(t, state) {
  var i, token, text,
      tokens = state.tokens,
      options = t.options;

  for (i = tokens.length - 1; i >= 0; i--) {
    token = tokens[i];
    if (token.type === 'text') {
      text = token.content;

      if (text.indexOf('(') >= 0) {
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

      if (options.plusminus && text.indexOf('+-') >= 0) {
        text = text.replace(/\+-/g, '±');
      }
      if (options.ellipsis && text.indexOf('..') >= 0) {
        // .., ..., ....... -> …
        // but ?..... & !..... -> ?.. & !..
        text = text.replace(/\.{2,}/g, '…').replace(/([?!])…/g, '$1..');
      }
      if (options.dupes &&
          (text.indexOf('????') >= 0 ||
           text.indexOf('!!!!') >= 0 ||
           text.indexOf(',,') >= 0)) {
        text = text.replace(/([?!]){4,}/g, '$1$1$1').replace(/,{2,}/g, ',');
      }
      if (options.emDashes && text.indexOf('--') >= 0) {
        text = text.replace(/(^|\s)--(\s|$)/mg, '$1—$2');
      }

      token.content = text;
    }
  }
};
