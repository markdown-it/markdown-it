// Class of typographic replacements rules
//
// - single quotes
// - double quotes
// - em-dashes
// - link patterns
// - email patterns
//
'use strict';

// TODO:
// - fractionals 1/2, 1/4, 3/4 -> ½, ¼, ¾
// - miltiplication 2 x 4 -> 2 × 4


var Autolinker = require('autolinker');


var assign     = require('./common/utils').assign;
var escapeHtml = require('./helpers').escapeHtml;
var defaults   = require('./defaults_typographer');
var Ruler      = require('./ruler');


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


var rules = [];


rules.push(function linkify(t, state) {
  var i, token, text, nodes, ln, pos, level,
      tokens = state.tokens;

  if (!t.options.linkify) { return; }

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
});


rules.push(function single(t, state) {
  var i, token, text,
      tokens = state.tokens,
      options = t.options;

  for (i = tokens.length - 1; i >= 0; i--) {
    token = tokens[i];
    if (token.type === 'text') {
      text = token.content;

      if (text.indexOf('(') >= 0) {
        if (options.copyright) {
          text = text.replace(/\(c\)/gi, '©');
        }
        if (options.trademark) {
          text = text.replace(/\(tm\)/gi, '™');
        }
        if (options.registered) {
          text = text.replace(/\(r\)/gi, '®');
        }
        if (options.paragraph) {
          text = text.replace(/\(p\)/gi, '§');
        }
      }

      if (options.plusminus && text.indexOf('+-') >= 0) {
        text = text.replace(/\+-/g, '±');
      }
      if (options.ellipsis && text.indexOf('..') >= 0) {
        // .., ..., ....... -> …
        // but ?..... & !..... -> ?.. & !..
        text = text.replace(/\.{2,}/g, '…').replace(/([?!])…/g, '$1..');
      }
      if (options.dupes &&
          (text.indexOf('????') >= 0 ||
           text.indexOf('!!!!') >= 0 ||
           text.indexOf(',,') >= 0)) {
        text = text.replace(/([?!]){4,}/g, '$1$1$1').replace(/,{2,}/g, ',');
      }
      if (options.emDashes && text.indexOf('--') >= 0) {
        text = text.replace(/(^|\s)--(\s|$)/mg, '$1—$2');
      }

      token.content = text;
    }
  }
});


function Typographer() {
  this.options  = assign({}, defaults);

  this.ruler = new Ruler(this.rulesUpdate.bind(this));

  for (var i = 0; i < rules.length; i++) {
    this.ruler.after(rules[i]);
  }
}


Typographer.prototype.rulesUpdate = function () {
  this._rules = this.ruler.getRules();
};


Typographer.prototype.set = function (options) {
  assign(this.options, options);
};


Typographer.prototype.process = function (state) {
  var i, l, rules;

  if (!state.options.typographer) { return; }

  rules = this._rules;

  for (i = 0, l = rules.length; i < l; i++) {
    rules[i](this, state);
  }
};


module.exports = Typographer;
