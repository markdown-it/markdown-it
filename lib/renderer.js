'use strict';


var assign = require('object-assign');


function escapeHtml(str) {
  return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
}

var MD_UNESCAPE_RE = /\\([!"#$%&\'()*+,.\/:;<=>?@[\\\]^_`{|}~-])/g;

function unescapeMd(str) {
  return str.replace(MD_UNESCAPE_RE, '$1');
}


// check if we need to hide '\n' before next token
function getBreak(state, idx) {
  if (++idx < state.tokens.length &&
      state.tokens[idx].type === 'list_item_close') {
    return '';
  }

  return '\n';
}


var rules = {};


rules.blockquote_open = function (state /*, token, idx*/) {
  state.result += '<blockquote>\n';
};
rules.blockquote_close = function (state, token, idx) {
  state.result += '</blockquote>' + getBreak(state, idx);
};


rules.code = function (state, token) {
  state.result += '<pre><code>' + escapeHtml(token.content) + '</code></pre>\n';
};


rules.fence = function (state, token) {
  var langMark = '';
  var langPrefix = state.options.codeLangPrefix || '';

  if (token.params.length) {
    langMark = ' class="' + langPrefix + escapeHtml(token.params[0]) + '"';
  }

  state.result += '<pre><code' + langMark + '>' + escapeHtml(token.content) + '</code></pre>\n';
};


rules.heading_open = function (state, token) {
  state.result += '<h' + token.level + '>';
};
rules.heading_close = function (state, token) {
  state.result += '</h' + token.level + '>\n';
};


rules.hr = function (state, token, idx) {
  state.result += (state.options.xhtml ? '<hr />' : '<hr>') + getBreak(state, idx);
};


rules.bullet_list_open = function (state /*, token, idx*/) {
  state.result += '<ul>\n';
};
rules.bullet_list_close = function (state, token, idx) {
  state.result += '</ul>' + getBreak(state, idx);
};
rules.list_item_open = function (state /*, token, idx*/) {
  state.result += '<li>';
};
rules.list_item_close = function (state /*, token, idx*/) {
  state.result += '</li>\n';
};
rules.ordered_list_open = function (state, token /*, idx */) {
  state.result += '<ol'
    + (token.order > 1 ? ' start="' + token.order + '"' : '')
    + '>\n';
};
rules.ordered_list_close = function (state, token, idx) {
  state.result += '</ol>' + getBreak(state, idx);
};


rules.paragraph_open = function (state /*, token, idx*/) {
  state.result += '<p>';
};
rules.paragraph_close = function (state, token, idx) {
  state.result += '</p>' + getBreak(state, idx);
};


rules.table_open = function (state /*, token, idx*/) {
  state.result += '<table>\n';
};
rules.table_close = function (state /*, token, idx*/) {
  state.result += '</table>\n';
};
rules.tr_open = function (state /*, token, idx*/) {
  state.result += '<tr>\n';
};
rules.tr_close = function (state /*, token, idx*/) {
  state.result += '</tr>\n';
};
rules.th_open = function (state, token) {
  state.result += '<th'
    + (token.align ? ' align="' + token.align + '"' : '')
    + '>';
};
rules.th_close = function (state /*, token, idx*/) {
  state.result += '</th>\n';
};
rules.td_open = function (state, token) {
  state.result += '<td'
    + (token.align ? ' align="' + token.align + '"' : '')
    + '>';
};
rules.td_close = function (state /*, token, idx*/) {
  state.result += '</td>\n';
};


rules.text = function (state, token) {
  state.result += escapeHtml(unescapeMd(token.content));
};


// Renderer class
function Renderer() {
  // Clone rules object to allow local modifications
  this.rules = assign({}, rules);
}

Renderer.prototype.render = function (state) {
  var i, len, rule, name,
      tokens = state.tokens,
      rules = this.rules,
      tightStack = [];

  // wrap paragraphs on top level by default
  state.tight = false;

  for (i = 0, len = tokens.length; i < len; i++) {
    name = tokens[i].type;
    rule = rules[name];

    // TODO: temporary check
    if (!rule) {
      throw new Error('Renderer error: unknown token ' + name);
    }

    // Dirty stack machine to track lists style (loose/tight)
    if (name === 'ordered_list_open' || name === 'bullet_list_open') {
      tightStack.push(state.tight);
      state.tight = tokens[i].tight;
    }
    if (name === 'ordered_list_close' || name === 'bullet_list_close') {
      state.tight = tightStack.pop();
    }

    // in tight mode just ignore paragraphs for lists
    // TODO - track right nesting to blockquotes
    if ((name === 'paragraph_open' || name === 'paragraph_close') && state.tight) {
      continue;
    }
    rule(state, tokens[i], i);
  }

  return state.result;
};

module.exports = Renderer;
