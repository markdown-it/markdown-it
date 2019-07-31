// Handle implicit links found by rules_core/linkify that were not yet
// subsumed by other inline rules (backticks, link, etc.)

'use strict';

module.exports.tokenize = function linkify(state, silent) {
  var link, url, fullUrl, urlText, token;

  if (state.links) {
    link = state.links[state.pos];
  }
  if (!link) {
    return false;
  }

  url = link.url;
  fullUrl = state.md.normalizeLink(url);
  if (!state.md.validateLink(fullUrl)) { return false; }
  urlText = link.text;

  // Linkifier might send raw hostnames like "example.com", where url
  // starts with domain name. So we prepend http:// in those cases,
  // and remove it afterwards.
  //
  if (!link.schema) {
    urlText = state.md.normalizeLinkText('http://' + urlText).replace(/^http:\/\//, '');
  } else if (link.schema === 'mailto:' && !/^mailto:/i.test(urlText)) {
    urlText = state.md.normalizeLinkText('mailto:' + urlText).replace(/^mailto:/, '');
  } else {
    urlText = state.md.normalizeLinkText(urlText);
  }

  if (!silent) {
    token         = state.push('link_open', 'a', 1);
    token.attrs   = [ [ 'href', fullUrl ] ];
    token.markup  = 'linkify';
    token.info    = 'auto';

    token         = state.push('text', '', 0);
    token.content = urlText;

    token         = state.push('link_close', 'a', -1);
    token.markup  = 'linkify';
    token.info    = 'auto';
  }

  state.pos = link.lastIndex;
  return true;
};

// Set state.links to an index from position to links, if links found
module.exports.preProcess = function linkify(state) {
  var links, i;
  if (!state.md.options.linkify || !state.md.linkify.pretest(state.src)) {
    return;
  }
  links = state.md.linkify.match(state.src);
  if (!links || !links.length) {
    return;
  }
  state.links = {};
  for (i = 0; i < links.length; i++) {
    state.links[links[i].index] = links[i];
  }
};

function isLinkOpen(str) {
  return /^<a[>\s]/i.test(str);
}
function isLinkClose(str) {
  return /^<\/a\s*>/i.test(str);
}

// Remove linkify links if already inside
module.exports.postProcess = function linkify(state) {
  var i, len, token, linkLevel = 0, htmlLinkLevel = 0;

  len = state.tokens.length;
  for (i = 0; i < len; i++) {
    token = state.tokens[i];

    // Transform into empty tokens any linkify open/close tags inside links
    if (token.markup === 'linkify') {
      if (linkLevel > 0 || htmlLinkLevel > 0) {
        if (token.type === 'link_open') {
          state.tokens[i + 1].level--;
        }
        token.type = 'text';
        token.attrs = token.markup = token.info = null;
        token.nesting = 0;
        token.content = '';
      }
      continue;
    }

    // Skip content of markdown links
    if (token.type === 'link_open') {
      linkLevel++;
    } else if (token.type === 'link_close' && linkLevel > 0) {
      linkLevel--;
    }

    // Skip content of html tag links
    if (token.type === 'html_inline') {
      if (isLinkOpen(token.content)) {
        htmlLinkLevel++;
      }
      if (isLinkClose(token.content) && htmlLinkLevel > 0) {
        htmlLinkLevel--;
      }
    }
  }
};
