// Inline parser state

'use strict';


function StateInline(src, lexer, options) {
  this.src = src;
  this.options = options;
  this.lexer = lexer;
  this.tokens = [];
  this.pos = 0;
  this.pending = '';
  this.posMax = this.src.length;
}


StateInline.prototype.pushText = function () {
  var pending = this.pending;
  // strip leading spaces from the first token.
  // others will be stripped by logic in `newline` rule
  if (this.tokens.length === 0 && pending.charCodeAt(0) === 0x20) {
    pending = pending.replace(/^ +/, '');
  }
  this.tokens.push({
    type: 'text',
    content: pending
  });
  this.pending = '';
};

StateInline.prototype.push = function (token) {
  if (this.pending) {
    this.pushText();
  }

  this.tokens.push(token);
};

module.exports = StateInline;
