// Process autolinks '<protocol:...>'


var escapeHtml  = require('../helpers').escapeHtml;
var url_schemas = require('../common/url_schemas');


/*eslint max-len:0*/
var EMAIL_RE    = /^<([a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)>/;
var AUTOLINK_RE = /^<([a-zA-Z.\-]{1,25}):([^<>\x00-\x20]*)>/;


module.exports = function autolink(state) {
  var tail, linkMatch, emailMatch, pos = state.pos;

  if (state.src.charCodeAt(pos) !== 0x3C/* < */) { return false; }

  tail = state.src.slice(pos);

  if (tail.indexOf('>') < 0) { return false; }

  linkMatch = tail.match(AUTOLINK_RE);

  if (linkMatch) {
    if (url_schemas.indexOf(linkMatch[1].toLowerCase()) < 0) { return false; }

    state.push({
      type: 'link_open',
      href: linkMatch[0].slice(1, -1)
    });
    state.push({
      type: 'text',
      content: escapeHtml(linkMatch[0].slice(1, -1))
    });
    state.push({ type: 'link_close' });

    state.pos += linkMatch[0].length;
    return true;
  }

  emailMatch = tail.match(EMAIL_RE);

  if (emailMatch) {
    state.tokens.push({
      type: 'link_open',
      href: 'mailto:' + emailMatch[0].slice(1, -1)
    });
    state.tokens.push({
      type: 'text',
      content: escapeHtml(emailMatch[0].slice(1, -1))
    });
    state.tokens.push({ type: 'link_close' });

    state.pos += emailMatch[0].length;
    return true;
  }

  return false;
};
