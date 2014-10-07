// Inline parser state

'use strict';


function StateInline(src, parser, options, env) {
  this.src = src;
  this.env = env;
  this.options = options;
  this.parser = parser;
  this.tokens = [];
  this.pos = 0;
  this.pending = '';
  this.posMax = this.src.length;
  this.validateInsideEm = false;
  this.validateInsideLink = false;
  this.level = 0;
  this.link_content = '';
  this.pendingLevel = 0;
}


StateInline.prototype.pushPending = function () {
  var pending = this.pending;

  this.tokens.push({
    type: 'text',
    content: pending,
    level: this.pendingLevel
  });
  this.pending = '';
};

StateInline.prototype.push = function (token) {
  if (this.pending) {
    this.pushPending();
  }

  this.tokens.push(token);
  this.pendingLevel = this.level;
};

module.exports = StateInline;
