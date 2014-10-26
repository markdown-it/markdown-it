// Convert straight quotation marks to typographic ones
//
'use strict';


var QUOTE_TEST_RE = /['"]/;
var QUOTE_RE = /['"]/g;
var PUNCT_RE = /[-\s()\[\]]/;
var APOSTROPHE = '’';

// This function returns true if the character at `pos`
// could be inside a word.
function isLetter(str, pos) {
  if (pos < 0 || pos >= str.length) { return false; }
  return !PUNCT_RE.test(str[pos]);
}


function addQuote(obj, tokenId, posId, str) {
  if (typeof obj[tokenId] === 'undefined') { obj[tokenId] = {}; }
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

    if (token.type !== 'text' || QUOTE_TEST_RE.test(token.text)) { continue; }

    thisLevel = tokens[i].level;

    for (j = stack.length - 1; j >= 0; j--) {
      if (stack[j].level <= thisLevel) { break; }
    }
    stack.length = j + 1;

    text = token.content;
    pos = 0;
    max = text.length;

    while (pos < max) {
      QUOTE_RE.lastIndex = pos;
      t = QUOTE_RE.exec(text);
      if (!t) { break; }

      lastSpace = !isLetter(text, t.index - 1);
      pos = t.index + t[0].length;
      isSingle = t[0] === "'";
      nextSpace = !isLetter(text, pos);

      if (!nextSpace && !lastSpace) {
        // middle word
        if (isSingle) {
          addQuote(replace, i, t.index, APOSTROPHE);
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
        addQuote(replace, i, t.index, APOSTROPHE);
      }
    }
  }

  fn = function(str, pos) {
    if (typeof replace[i][pos] === 'undefined') { return str; }
    return replace[i][pos];
  };

  for (i = 0; i < tokens.length; i++) {
    if (typeof replace[i] === 'undefined') { continue; }
    QUOTE_RE.lastIndex = 0;
    tokens[i].content = tokens[i].content.replace(QUOTE_RE, fn);
  }
};
