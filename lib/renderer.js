'use strict';


var assign = require('object-assign');
var escapeHtml = require('./helpers').escapeHtml;
var escapeHtmlKeepEntities = require('./helpers').escapeHtmlKeepEntities;
var unescapeMd = require('./helpers').unescapeMd;


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
  var langMark = '';
  var langPrefix = options.langprefix || '';
  var params;

  if (token.params) {
    params = token.params.split(/ +/g);
    langMark = ' class="' + langPrefix + escapeHtmlKeepEntities(unescapeMd(params[0])) + '"';
  }

  return  '<pre><code' + langMark + '>'
        + escapeHtml(token.content)
        + '</code></pre>' + getBreak(tokens, idx);
};


rules.heading_open = function (tokens, idx /*, options*/) {
  return '<h' + tokens[idx].level + '>';
};
rules.heading_close = function (tokens, idx /*, options*/) {
  return '</h' + tokens[idx].level + '>\n';
};


rules.hr = function (tokens, idx, options) {
  return (options.xhtml ? '<hr />' : '<hr>') + getBreak(tokens, idx);
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
  return '<a href="' + escapeHtmlKeepEntities(tokens[idx].href) + '">';
};
rules.link_close = function (/*tokens, idx, options*/) {
  return '</a>';
};


rules.table_open = function (/*tokens, idx, options*/) {
  return '<table>\n';
};
rules.table_close = function (/*tokens, idx, options*/) {
  return '</table>\n';
};
rules.tr_open = function (/*tokens, idx, options*/) {
  return '<tr>\n';
};
rules.tr_close = function (/*tokens, idx, options*/) {
  return '</tr>\n';
};
rules.th_open = function (tokens, idx /*, options*/) {
  var token = tokens[idx];
  return '<th'
    + (token.align ? ' align="' + token.align + '"' : '')
    + '>';
};
rules.th_close = function (/*tokens, idx, options*/) {
  return '</th>\n';
};
rules.td_open = function (tokens, idx /*, options*/) {
  var token = tokens[idx];
  return '<td'
    + (token.align ? ' align="' + token.align + '"' : '')
    + '>';
};
rules.td_close = function (/*tokens, idx, options*/) {
  return '</td>\n';
};


rules.hardbreak = function (tokens, idx, options) {
  return (options.xhtml ? '<br />' : '<br>') + '\n';
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
  var i, len, rule, name, next,
      result = '',
      rules = this.rules,
      tightStack = [];

  // wrap paragraphs on top level by default
  var tight = false;

  for (i = 0, len = tokens.length; i < len; i++) {
    name = tokens[i].type;
    rule = rules[name];

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
      if (i + 1 < tokens.length) {
        next = tokens[i + 1].type;
        if (next === 'bullet_list_open' ||
            next === 'ordered_list_open' ||
            next === 'blockquote_open') {
          result += '\n';
        }
      }

      continue;
    }

    if (tokens[i].type === 'inline') {
      result += this.render(tokens[i].children, options);
    } else {
      // TODO: temporary check
      if (!rule) {
        throw new Error('Renderer error: unknown token ' + name);
      }
      result += rule(tokens, i, options);
    }
  }

  return result;
};

module.exports = Renderer;
