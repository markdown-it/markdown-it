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
