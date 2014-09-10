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


var rules = {};


rules.blockquote_open = function (state /*, token*/) {
  state.result += '<blockquote>\n';
};
rules.blockquote_close = function (state /*, token*/) {
  state.result += '</blockquote>\n';
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


rules.hr = function (state/*, token*/) {
  state.result += state.options.xhtml ? '<hr />\n' : '<hr>\n';
};


rules.bullet_list_open = function (state /*, token*/) {
  state.result += '<ul>\n';
};
rules.bullet_list_close = function (state /*, token*/) {
  state.result += '</ul>\n';
};
rules.list_item_open = function (state /*, token*/) {
  state.result += '<li>';
};
rules.list_item_close = function (state /*, token*/) {
  state.result += '</li>\n';
};
rules.ordered_list_open = function (state, token) {
  state.result += '<ol'
    + (token.order > 1 ? ' start="' + token.order + '"' : '')
    + '>\n';
};
rules.ordered_list_close = function (state /*, token*/) {
  state.result += '</ol>\n';
};


rules.paragraph_open = function (state /*, token*/) {
  state.result += '<p>';
};
rules.paragraph_close = function (state /*, token*/) {
  state.result += '</p>\n';
};


rules.table_open = function (state /*, token*/) {
  state.result += '<table>\n';
};
rules.table_close = function (state /*, token*/) {
  state.result += '</table>\n';
};
rules.tr_open = function (state /*, token*/) {
  state.result += '<tr>\n';
};
rules.tr_close = function (state /*, token*/) {
  state.result += '</tr>\n';
};
rules.th_open = function (state, token) {
  state.result += '<th'
    + (token.align ? ' align="' + token.align + '"' : '')
    + '>';
};
rules.th_close = function (state /*, token*/) {
  state.result += '</th>\n';
};
rules.td_open = function (state, token) {
  state.result += '<td'
    + (token.align ? ' align="' + token.align + '"' : '')
    + '>';
};
rules.td_close = function (state /*, token*/) {
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
  var i, len, rule,
      tokens = state.tokens,
      rules = this.rules;

  for (i = 0, len = tokens.length; i < len; i++) {
    rule = rules[tokens[i].type];

    // TODO: temporary check
    if (!rule) {
      throw new Error('Renderer error: unknown token ' + tokens[i].type);
    }

    rule(state, tokens[i]);
  }

  return state.result;
};

module.exports = Renderer;
