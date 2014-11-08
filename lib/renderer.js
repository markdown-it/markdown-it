'use strict';


var assign          = require('./common/utils').assign;
var unescapeMd      = require('./common/utils').unescapeMd;
var replaceEntities = require('./common/utils').replaceEntities;


////////////////////////////////////////////////////////////////////////////////
// Helpers

var HTML_ESCAPE_TEST_RE = /[&<>"]/;
var HTML_ESCAPE_REPLACE_RE = /[&<>"]/g;
var HTML_REPLACEMENTS = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;'
};

function replaceUnsafeChar(ch) {
  return HTML_REPLACEMENTS[ch];
}

function escapeHtml(str) {
  if (HTML_ESCAPE_TEST_RE.test(str)) {
    return str.replace(HTML_ESCAPE_REPLACE_RE, replaceUnsafeChar);
  }
  return str;
}

function nextToken(tokens, idx) {
  if (++idx >= tokens.length - 2) { return idx; }
  if ((tokens[idx].type === 'paragraph_open' && tokens[idx].tight) &&
      (tokens[idx + 1].type === 'inline' && tokens[idx + 1].content.length === 0) &&
      (tokens[idx + 2].type === 'paragraph_close' && tokens[idx + 2].tight)) {
    return nextToken(tokens, idx + 2);
  }
  return idx;
}


// check if we need to hide '\n' before next token
function getBreak(tokens, idx) {
  idx = nextToken(tokens, idx);
  if (idx < tokens.length &&
      tokens[idx].type === 'list_item_close') {
    return '';
  }

  return '\n';
}

////////////////////////////////////////////////////////////////////////////////

var rules = {};



rules.blockquote_open = function () {
  return '<blockquote>\n';
};
rules.blockquote_close = function (tokens, idx) {
  return '</blockquote>' + getBreak(tokens, idx);
};


rules.code = function (tokens, idx) {
  if (tokens[idx].block) {
    return '<pre><code>' + escapeHtml(tokens[idx].content) + '</code></pre>' + getBreak(tokens, idx);
  }

  return '<code>' + escapeHtml(tokens[idx].content) + '</code>';
};


rules.fence = function (tokens, idx, options) {
  var token = tokens[idx];
  var langClass = '';
  var langPrefix = options.langPrefix;
  var params, langName = '';
  var highlighted;

  if (token.params) {
    params = token.params.split(/ +/g);
    langName = escapeHtml(replaceEntities(unescapeMd(params[0])));
    langClass = ' class="' + langPrefix + langName + '"';
  }

  if (options.highlight) {
    highlighted = options.highlight(token.content, langName) || escapeHtml(token.content);
  } else {
    highlighted = escapeHtml(token.content);
  }


  return  '<pre><code' + langClass + '>'
        + highlighted
        + '</code></pre>' + getBreak(tokens, idx);
};


rules.heading_open = function (tokens, idx) {
  return '<h' + tokens[idx].hLevel + '>';
};
rules.heading_close = function (tokens, idx) {
  return '</h' + tokens[idx].hLevel + '>\n';
};


rules.hr = function (tokens, idx, options) {
  return (options.xhtmlOut ? '<hr />' : '<hr>') + getBreak(tokens, idx);
};


rules.bullet_list_open = function () {
  return '<ul>\n';
};
rules.bullet_list_close = function (tokens, idx) {
  return '</ul>' + getBreak(tokens, idx);
};
rules.list_item_open = function () {
  return '<li>';
};
rules.list_item_close = function () {
  return '</li>\n';
};
rules.ordered_list_open = function (tokens, idx) {
  var token = tokens[idx];
  return '<ol'
    + (token.order > 1 ? ' start="' + token.order + '"' : '')
    + '>\n';
};
rules.ordered_list_close = function (tokens, idx) {
  return '</ol>' + getBreak(tokens, idx);
};


rules.paragraph_open = function (tokens, idx) {
  return tokens[idx].tight ? '' : '<p>';
};
rules.paragraph_close = function (tokens, idx) {
  var addBreak = !(tokens[idx].tight && idx && tokens[idx - 1].type === 'inline' && !tokens[idx - 1].content);
  return (tokens[idx].tight ? '' : '</p>') + (addBreak ? getBreak(tokens, idx) : '');
};


rules.link_open = function (tokens, idx) {
  var title = tokens[idx].title ? (' title="' + escapeHtml(replaceEntities(tokens[idx].title)) + '"') : '';
  return '<a href="' + escapeHtml(encodeURI(decodeURI(replaceEntities(tokens[idx].href)))) + '"' + title + '>';
};
rules.link_close = function () {
  return '</a>';
};


rules.image = function (tokens, idx, options) {
  var src = ' src="' + escapeHtml(encodeURI(tokens[idx].src)) + '"';
  var title = tokens[idx].title ? (' title="' + escapeHtml(replaceEntities(tokens[idx].title)) + '"') : '';
  var alt = ' alt="' + (tokens[idx].alt ? escapeHtml(replaceEntities(tokens[idx].alt)) : '') + '"';
  var suffix = options.xhtmlOut ? ' /' : '';
  return '<img' + src + alt + title + suffix + '>';
};


rules.table_open = function () {
  return '<table>\n';
};
rules.table_close = function () {
  return '</table>\n';
};
rules.thead_open = function () {
  return '<thead>\n';
};
rules.thead_close = function () {
  return '</thead>\n';
};
rules.tbody_open = function () {
  return '<tbody>\n';
};
rules.tbody_close = function () {
  return '</tbody>\n';
};
rules.tr_open = function () {
  return '<tr>';
};
rules.tr_close = function () {
  return '</tr>\n';
};
rules.th_open = function (tokens, idx) {
  var token = tokens[idx];
  return '<th'
    + (token.align ? ' style="text-align:' + token.align + '"' : '')
    + '>';
};
rules.th_close = function () {
  return '</th>';
};
rules.td_open = function (tokens, idx) {
  var token = tokens[idx];
  return '<td'
    + (token.align ? ' style="text-align:' + token.align + '"' : '')
    + '>';
};
rules.td_close = function () {
  return '</td>';
};


rules.strong_open = function() {
  return '<strong>';
};
rules.strong_close = function() {
  return '</strong>';
};
rules.em_open = function() {
  return '<em>';
};
rules.em_close = function() {
  return '</em>';
};


rules.del_open = function() {
  return '<del>';
};
rules.del_close = function() {
  return '</del>';
};


rules.ins_open = function() {
  return '<ins>';
};
rules.ins_close = function() {
  return '</ins>';
};


rules.mark_open = function() {
  return '<mark>';
};
rules.mark_close = function() {
  return '</mark>';
};


rules.sub = function(tokens, idx/*, options*/) {
  return '<sub>' + escapeHtml(tokens[idx].content) + '</sub>';
};
rules.sup = function(tokens, idx/*, options*/) {
  return '<sup>' + escapeHtml(tokens[idx].content) + '</sup>';
};


rules.hardbreak = function (tokens, idx, options) {
  return options.xhtmlOut ? '<br />\n' : '<br>\n';
};
rules.softbreak = function (tokens, idx, options) {
  return options.breaks ? (options.xhtmlOut ? '<br />\n' : '<br>\n') : '\n';
};


rules.text = function (tokens, idx) {
  return escapeHtml(tokens[idx].content);
};


rules.htmlblock = function (tokens, idx) {
  return tokens[idx].content;
};
rules.htmltag = function (tokens, idx) {
  return tokens[idx].content;
};


rules.abbr_open = function (tokens, idx) {
  return '<abbr title="' + escapeHtml(replaceEntities(tokens[idx].title)) + '">';
};
rules.abbr_close = function () {
  return '</abbr>';
};


// Renderer class
function Renderer() {
  // Clone rules object to allow local modifications
  this.rules = assign({}, rules);
}


Renderer.prototype.renderInline = function (tokens, options, env) {
  var result = '',
      _rules = this.rules;

  for (var i = 0, len = tokens.length; i < len; i++) {
    result += _rules[tokens[i].type](tokens, i, options, env);
  }

  return result;
};


Renderer.prototype.render = function (tokens, options, env) {
  var i, len,
      result = '',
      _rules = this.rules;

  for (i = 0, len = tokens.length; i < len; i++) {
    if (tokens[i].type === 'inline') {
      result += this.renderInline(tokens[i].children, options, env);
    } else {
      result += _rules[tokens[i].type](tokens, i, options, env);
    }
  }

  return result;
};

module.exports = Renderer;
