'use strict';


var assign          = require('./common/utils').assign;
var escapeHtml      = require('./common/utils').escapeHtml;
var unescapeMd      = require('./common/utils').unescapeMd;
var replaceEntities = require('./common/utils').replaceEntities;


function escapeUrl(str) {
  try {
    return encodeURI(str);
  } catch (__) {}
  return '';
}
function unescapeUrl(str) {
  try {
    return decodeURI(str);
  } catch (__) {}
  return '';
}


// check if we need to hide '\n' before next token
function getBreak(tokens, idx) {
  if (++idx < tokens.length &&
      tokens[idx].type === 'list_item_close') {
    return '';
  }

  return '\n';
}

var rules = {};


rules.blockquote_open = function (/*tokens, idx, options*/) {
  return '<blockquote>\n';
};
rules.blockquote_close = function (tokens, idx /*, options*/) {
  return '</blockquote>' + getBreak(tokens, idx);
};


rules.code = function (tokens, idx /*, options*/) {
  if (tokens[idx].block) {
    return '<pre><code>' + escapeHtml(tokens[idx].content) + '</code></pre>' + getBreak(tokens, idx);
  }

  return '<code>' + escapeHtml(tokens[idx].content) + '</code>';
};


rules.fence = function (tokens, idx, options) {
  var token = tokens[idx];
  var langClass = '';
  var langPrefix = options.langPrefix || '';
  var params, langName = '';
  var highlighted;

  if (token.params) {
    params = token.params.split(/ +/g);
    langName = escapeHtml(replaceEntities(unescapeMd(params[0])));
    langClass = ' class="' + langPrefix + langName + '"';
  }

  highlighted = options.highlight(token.content, langName) || escapeHtml(token.content);

  return  '<pre><code' + langClass + '>'
        + highlighted
        + '</code></pre>' + getBreak(tokens, idx);
};


rules.heading_open = function (tokens, idx /*, options*/) {
  return '<h' + tokens[idx].hLevel + '>';
};
rules.heading_close = function (tokens, idx /*, options*/) {
  return '</h' + tokens[idx].hLevel + '>\n';
};


rules.hr = function (tokens, idx, options) {
  return (options.xhtmlOut ? '<hr />' : '<hr>') + getBreak(tokens, idx);
};


rules.bullet_list_open = function (/*tokens, idx, options*/) {
  return '<ul>\n';
};
rules.bullet_list_close = function (tokens, idx /*, options*/) {
  return '</ul>' + getBreak(tokens, idx);
};
rules.list_item_open = function (/*tokens, idx, options*/) {
  return '<li>';
};
rules.list_item_close = function (/*tokens, idx, options*/) {
  return '</li>\n';
};
rules.ordered_list_open = function (tokens, idx /*, options*/) {
  var token = tokens[idx];
  return '<ol'
    + (token.order > 1 ? ' start="' + token.order + '"' : '')
    + '>\n';
};
rules.ordered_list_close = function (tokens, idx /*, options*/) {
  return '</ol>' + getBreak(tokens, idx);
};


rules.paragraph_open = function (/*tokens, idx, options*/) {
  return '<p>';
};
rules.paragraph_close = function (tokens, idx /*, options*/) {
  return '</p>' + getBreak(tokens, idx);
};


rules.link_open = function (tokens, idx /*, options*/) {
  var title = tokens[idx].title ? (' title="' + escapeHtml(replaceEntities(tokens[idx].title)) + '"') : '';
  return '<a href="' + escapeHtml(escapeUrl(unescapeUrl(replaceEntities(tokens[idx].href)))) + '"' + title + '>';
};
rules.link_close = function (/*tokens, idx, options*/) {
  return '</a>';
};


rules.image = function (tokens, idx, options) {
  var src = ' src="' + escapeHtml(escapeUrl(tokens[idx].src)) + '"';
  var title = tokens[idx].title ? (' title="' + escapeHtml(replaceEntities(tokens[idx].title)) + '"') : '';
  var alt = ' alt="' + (tokens[idx].alt ? escapeHtml(replaceEntities(tokens[idx].alt)) : '') + '"';
  var suffix = options.xhtmlOut ? ' /' : '';
  return '<img' + src + alt + title + suffix + '>';
};


rules.table_open = function (/*tokens, idx, options*/) {
  return '<table>\n';
};
rules.table_close = function (/*tokens, idx, options*/) {
  return '</table>\n';
};
rules.thead_open = function (/*tokens, idx, options*/) {
  return '<thead>\n';
};
rules.thead_close = function (/*tokens, idx, options*/) {
  return '</thead>\n';
};
rules.tbody_open = function (/*tokens, idx, options*/) {
  return '<tbody>\n';
};
rules.tbody_close = function (/*tokens, idx, options*/) {
  return '</tbody>\n';
};
rules.tr_open = function (/*tokens, idx, options*/) {
  return '<tr>';
};
rules.tr_close = function (/*tokens, idx, options*/) {
  return '</tr>\n';
};
rules.th_open = function (tokens, idx /*, options*/) {
  var token = tokens[idx];
  return '<th'
    + (token.align ? ' style="text-align:' + token.align + '"' : '')
    + '>';
};
rules.th_close = function (/*tokens, idx, options*/) {
  return '</th>';
};
rules.td_open = function (tokens, idx /*, options*/) {
  var token = tokens[idx];
  return '<td'
    + (token.align ? ' style="text-align:' + token.align + '"' : '')
    + '>';
};
rules.td_close = function (/*tokens, idx, options*/) {
  return '</td>';
};


rules.strong_open = function(/*tokens, idx, options*/) {
  return '<strong>';
};
rules.strong_close = function(/*tokens, idx, options*/) {
  return '</strong>';
};
rules.em_open = function(/*tokens, idx, options*/) {
  return '<em>';
};
rules.em_close = function(/*tokens, idx, options*/) {
  return '</em>';
};


rules.del_open = function(/*tokens, idx, options*/) {
  return '<del>';
};
rules.del_close = function(/*tokens, idx, options*/) {
  return '</del>';
};


rules.hardbreak = function (tokens, idx, options) {
  return options.xhtmlOut ? '<br />\n' : '<br>\n';
};
rules.softbreak = function (tokens, idx, options) {
  return options.breaks ? (options.xhtmlOut ? '<br />\n' : '<br>\n') : '\n';
};


rules.text = function (tokens, idx /*, options*/) {
  return tokens[idx].content;
};


rules.htmlblock = function (tokens, idx /*, options*/) {
  return tokens[idx].content;
};
rules.htmltag = function (tokens, idx /*, options*/) {
  return tokens[idx].content;
};


// Renderer class
function Renderer() {
  // Clone rules object to allow local modifications
  this.rules = assign({}, rules);
}


Renderer.prototype.render = function (tokens, options) {
  var i, len, name,
      result = '',
      rules = this.rules,
      tightStack = [];

  // wrap paragraphs on top level by default
  var tight = false;

  for (i = 0, len = tokens.length; i < len; i++) {
    name = tokens[i].type;

    // Dirty stack machine to track lists style (loose/tight)
    if (name === 'ordered_list_open' || name === 'bullet_list_open') {
      tightStack.push(tight);
      tight = tokens[i].tight;
    }
    if (name === 'ordered_list_close' || name === 'bullet_list_close') {
      tight = tightStack.pop();
    }
    if (name === 'blockquote_open') {
      tightStack.push(tight);
      tight = false;
    }
    if (name === 'blockquote_close') {
      tight = tightStack.pop();
    }


    // in tight mode just ignore paragraphs for lists
    // TODO - track right nesting to blockquotes
    if (name === 'paragraph_open' && tight) {
      continue;
    }
    if (name === 'paragraph_close' && tight) {
      // Quick hack - texts should have LF if followed by blocks
      if (tokens[i + 1].type !== 'list_item_close') {
        result += '\n';
      }

      continue;
    }

    if (tokens[i].type === 'inline') {
      result += this.render(tokens[i].children, options);
    } else {
      result += rules[name](tokens, i, options);
    }
  }

  return result;
};

module.exports = Renderer;
