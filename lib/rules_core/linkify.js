// Replace link-like texts with link nodes.
//
// Currently restricted by `inline.validateLink()` to http/https/ftp
//
'use strict';


var arrayReplaceAt = require('../common/utils').arrayReplaceAt;
var normalizeLink  = require('../common/utils').normalizeLink;


function isLinkOpen(str) {
  return /^<a[>\s]/i.test(str);
}
function isLinkClose(str) {
  return /^<\/a\s*>/i.test(str);
}


module.exports = function linkify(state) {
  var i, j, l, tokens, token, nodes, ln, text, pos, lastPos, level, htmlLinkLevel,
      blockTokens = state.tokens,
      links;

  if (!state.md.options.linkify) { return; }

  for (j = 0, l = blockTokens.length; j < l; j++) {
    if (blockTokens[j].type !== 'inline') { continue; }

    tokens = blockTokens[j].children;

    htmlLinkLevel = 0;

    // We scan from the end, to keep position when new tags added.
    // Use reversed logic in links start/end match
    for (i = tokens.length - 1; i >= 0; i--) {
      token = tokens[i];

      // Skip content of markdown links
      if (token.type === 'link_close') {
        i--;
        while (tokens[i].level !== token.level && tokens[i].type !== 'link_open') {
          i--;
        }
        continue;
      }

      // Skip content of html tag links
      if (token.type === 'html_inline') {
        if (isLinkOpen(token.content) && htmlLinkLevel > 0) {
          htmlLinkLevel--;
        }
        if (isLinkClose(token.content)) {
          htmlLinkLevel++;
        }
      }
      if (htmlLinkLevel > 0) { continue; }

      if (token.type === 'text' && state.md.linkify.test(token.content)) {

        text = token.content;
        links = state.md.linkify.match(text);

        // Now split string to nodes
        nodes = [];
        level = token.level;
        lastPos = 0;

        for (ln = 0; ln < links.length; ln++) {

          if (!state.md.inline.validateLink(links[ln].url)) { continue; }

          pos = links[ln].index;

          if (pos > lastPos) {
            level = level;
            nodes.push({
              type: 'text',
              content: text.slice(lastPos, pos),
              level: level
            });
          }
          nodes.push({
            type: 'link_open',
            href: normalizeLink(links[ln].url),
            target: '',
            title: '',
            level: level++
          });
          nodes.push({
            type: 'text',
            content: links[ln].text,
            level: level
          });
          nodes.push({
            type: 'link_close',
            level: --level
          });
          lastPos = links[ln].lastIndex;
        }
        if (lastPos < text.length) {
          nodes.push({
            type: 'text',
            content: text.slice(lastPos),
            level: level
          });
        }

        // replace current node
        blockTokens[j].children = tokens = arrayReplaceAt(tokens, i, nodes);
      }
    }
  }
};
