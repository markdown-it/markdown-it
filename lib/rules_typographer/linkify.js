// Replace link-like texts with link nodes.
//
// Currently restricted to http/https/ftp
//
'use strict';


var Autolinker = require('autolinker');
var escapeHtml = require('../helpers').escapeHtml;


var links = [];
var autolinker = new Autolinker({
  stripPrefix: false,
  replaceFn: function (autolinker, match) {
    // Only collect matched strings but don't change anything.
    var url;
    if (match.getType() === 'url') {
      url = match.getUrl();
      if (/^(http|https|ftp|git)/.test(url)) {
        links.push(url);
      }
    }
    return false;
  }
});


module.exports = function linkify(t, state) {
  var i, token, text, nodes, ln, pos, level,
      tokens = state.tokens;

  for (i = tokens.length - 1; i >= 0; i--) {
    token = tokens[i];

    // Skip content of links
    if (token.type === 'link_close') {
      i--;
      while (tokens[i].type !== 'link_open' && tokens[i].level !== token.level) {
        i--;
      }
      i--;
      continue;
    }

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
        pos = text.indexOf(links[ln]);
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
          href: links[ln],
          title: '',
          level: level++
        });
        nodes.push({
          type: 'text',
          content: escapeHtml(links[ln]),
          level: level
        });
        nodes.push({
          type: 'link_close',
          level: --level
        });
        text = text.slice(pos + links[ln].length);
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
