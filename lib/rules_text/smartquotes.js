// Convert straight quotation marks to typographic ones
//
'use strict';


var quoteReg = /['"]/g;
var punctReg = /[-\s()\[\]]/;
var apostrophe = '’';

// This function returns true if the character at `pos`
// could be inside a word.
function isLetter(str, pos) {
  if (pos < 0 || pos >= str.length) { return false; }
  return !punctReg.test(str[pos]);
}


function addQuote(obj, tokenId, posId, str) {
  if (!obj[tokenId]) { obj[tokenId] = {}; }
  obj[tokenId][posId] = str;
}


module.exports = function smartquotes(typographer, state) {
  /*eslint max-depth:0*/
  var i, token, text, t, pos, max, thisLevel, lastSpace, nextSpace, item, canOpen, canClose, j, isSingle, fn, chars,
      options = typographer.options,
      replace = {},
      tokens = state.tokens,
      stack = [];

  for (i = 0; i < tokens.length; i++) {
    token = tokens[i];
    thisLevel = tokens[i].level;

    for (j = stack.length - 1; j >= 0; j--) {
      if (stack[j].level <= thisLevel) { break; }
    }
    stack.length = j + 1;

    if (token.type === 'text') {
      text = token.content;
      pos = 0;
      max = text.length;

      while (pos < max) {
        quoteReg.lastIndex = pos;
        t = quoteReg.exec(text);
        if (!t) { break; }

        lastSpace = !isLetter(text, t.index - 1);
        pos = t.index + t[0].length;
        isSingle = t[0] === "'";
        nextSpace = !isLetter(text, pos);

        if (!nextSpace && !lastSpace) {
          // middle word
          if (isSingle) {
            addQuote(replace, i, t.index, apostrophe);
          }
          continue;
        }

        canOpen = !nextSpace;
        canClose = !lastSpace;

        if (canClose) {
          // this could be a closing quote, rewind the stack to get a match
          for (j = stack.length - 1; j >= 0; j--) {
            item = stack[j];
            if (stack[j].level < thisLevel) { break; }
            if (item.single === isSingle && stack[j].level === thisLevel) {
              item = stack[j];
              chars = isSingle ? options.singleQuotes : options.doubleQuotes;
              if (chars) {
                addQuote(replace, item.token, item.start, chars[0]);
                addQuote(replace, i, t.index, chars[1]);
              }
              stack.length = j;
              canOpen = false; // should be "continue OUTER;", but eslint refuses labels :(
              break;
            }
          }
        }

        if (canOpen) {
          stack.push({
            token: i,
            start: t.index,
            end: pos,
            single: isSingle,
            level: thisLevel
          });
        } else if (canClose && isSingle) {
          addQuote(replace, i, t.index, apostrophe);
        }
      }
    }
  }

  fn = function(str, pos) {
    if (!replace[i][pos]) { return str; }
    return replace[i][pos];
  };

  for (i = 0; i < tokens.length; i++) {
    if (!replace[i]) { continue; }
    quoteReg.lastIndex = 0;
    tokens[i].content = tokens[i].content.replace(quoteReg, fn);
  }
};
