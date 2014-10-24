// Replace link-like texts with link nodes.
//
// Currently restricted to http/https/ftp
//
'use strict';


var Autolinker = require('autolinker');
var escapeHtml = require('../common/utils').escapeHtml;


var links = [];
var autolinker = new Autolinker({
  stripPrefix: false,
  replaceFn: function (autolinker, match) {
    // Only collect matched strings but don't change anything.
    if (match.getType() === 'url') {
      links.push({ text: match.matchedText, url: match.getUrl() });
    }
    return false;
  }
});

function isLinkOpen(str) {
  return /^<a[>\s]/i.test(str);
}
function isLinkClose(str) {
  return /^<\/a\s*>/i.test(str);
}


module.exports = function linkify(t, state) {
  var i, token, text, nodes, ln, pos, level,
      htmlLinkLevel = 0,
      tokens = state.tokens;

  // We scan from the end, to keep position when new tags added.
  // Use reversed logic in links start/end match
  for (i = tokens.length - 1; i >= 0; i--) {
    token = tokens[i];

    // Skip content of markdown links
    if (token.type === 'link_close') {
      i--;
      while (tokens[i].type !== 'link_open' && tokens[i].level !== token.level) {
        i--;
      }
      i--;
      continue;
    }

    // Skip content of html tag links
    if (token.type === 'htmltag') {
      if (isLinkOpen(token.content) && htmlLinkLevel > 0) {
        htmlLinkLevel--;
      }
      if (isLinkClose(token.content)) {
        htmlLinkLevel++;
      }
    }
    if (htmlLinkLevel > 0) { continue; }

    if (token.type === 'text' &&
        (token.content.indexOf('://') ||
         token.content.indexOf('www'))) {
      text = token.content;
      links = [];
      autolinker.link(text);

      if (!links.length) { continue; }

      // Now split string to nodes
      nodes = [];
      level = token.level;

      for (ln = 0; ln < links.length; ln++) {

        if (!state.parser.validateLink(links[ln].url)) { continue; }

        pos = text.indexOf(links[ln].text);

        if (pos === -1) { continue; }

        if (pos) {
          level = level;
          nodes.push({
            type: 'text',
            content: text.slice(0, pos),
            level: level
          });
        }
        nodes.push({
          type: 'link_open',
          href: links[ln].url,
          title: '',
          level: level++
        });
        nodes.push({
          type: 'text',
          content: escapeHtml(links[ln].text),
          level: level
        });
        nodes.push({
          type: 'link_close',
          level: --level
        });
        text = text.slice(pos + links[ln].text.length);
      }
      if (text.length) {
        nodes.push({
          type: 'text',
          content: text,
          level: level
        });
      }

      // replace cuttent node
      state.tokens = tokens = [].concat(tokens.slice(0, i), nodes, tokens.slice(i + 1));
    }
  }
};
