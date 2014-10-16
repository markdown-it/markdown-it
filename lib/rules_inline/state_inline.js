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
  this.linkLevel = 0;
  this.level = 0;
  this.link_content = '';
  this.pendingLevel = 0;
  this.label_nest_level = 0; // for stmd-like backtrack optimization
}


StateInline.prototype.pushPending = function () {
  this.tokens.push({
    type: 'text',
    content: this.pending,
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
