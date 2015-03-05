// Token class

'use strict';


// Create a token
//
function Token(type, tag, nesting) {
  // type of the token (string, e.g. "paragraph_open")
  this.type     = type;

  // html tag name, e.g. "p"
  this.tag      = tag;

  // html attributes, format:
  // [ [ name1, value1 ], [ name2, value2 ] ]
  this.attrs    = null;

  // source map info, format:
  // [ line_begin, line_end ]
  this.map      = null;

  // level change (number in {-1, 0, 1} set), where:
  //  -  `1` means the tag is opening
  //  -  `0` means the tag is self-closing
  //  - `-1` means the tag is closing
  this.nesting  = nesting;

  // nesting level, same as `state.level`
  this.level    = 0;

  // an array of child nodes (inline and img tokens)
  this.children = null;

  // in a case of self-closing tag (code, html, fence, etc.),
  // it has contents of this tag
  this.content  = null;

  // '*' or '_' for emphasis, fence string for fence, etc.
  this.markup   = '';

  // fence infostring
  this.info     = null;

  // block or inline-level token,
  // used in renderer to calculate line breaks
  this.block    = false;

  // if it's true, ignore this element when rendering
  this.hidden   = false;
}


module.exports = Token;
