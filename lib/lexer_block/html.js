// HTML block

'use strict';


var isEmpty   = require('../helpers').isEmpty;
var getLines  = require('../helpers').getLines;


function replace(regex, options) {
  regex = regex.source;
  options = options || '';

  return function self(name, val) {
    if (!name) {
      return new RegExp(regex, options);
    }
    val = val.source || val;
    val = val.replace(/(^|[^\[])\^/g, '$1');
    regex = regex.replace(name, val);
    return self;
  };
}


var attr_name   = /[a-zA-Z_:][a-zA-Z0-9:._-]*/;

var unquoted      = /[^"'=<>`\x00-\x20]+/;
var single_quoted = /'[^']*'/;
var double_quoted = /"[^"]*"/;

/*eslint no-spaced-func:0*/
var attr_value  = replace(/(?:unquoted|single_quoted|double_quoted)/)
                    ('unquoted', unquoted)
                    ('single_quoted', single_quoted)
                    ('double_quoted', double_quoted)
                    ();

var attribute   = replace(/(?:\s+attr_name(?:\s*=\s*attr_value)?)/)
                    ('attr_name', attr_name)
                    ('attr_value', attr_value)
                    ();

var open_tag    = replace(/<[A-Za-z][A-Za-z0-9]*attribute*\s*\/?>/)
                    ('attribute', attribute)
                    ();

var close_tag   = /<\/[A-Za-z][A-Za-z0-9]*\s*>/;
var comment     = /<!--([^-]+|[-][^-]+)*-->/;
var processing  = /<[?].*?[?]>/;
var declaration = /<![A-Z]\s+[^>]*>/;
var cdata       = /<!\[CDATA\[([^\]]+|\][^\]]|\]\][^>])*\]\]>/;

var html_tag = replace(/^(?:open_tag|close_tag|comment|processing|declaration|cdata)/, 'i')
  ('open_tag', open_tag)
  ('close_tag', close_tag)
  ('comment', comment)
  ('processing', processing)
  ('declaration', declaration)
  ('cdata', cdata)
  ();


module.exports = function html(state, startLine, endLine, silent) {
  var nextLine,
      pos = state.bMarks[startLine],
      max = state.eMarks[startLine],
      shift = state.tShift[startLine];

  pos += shift;

  if (pos + 3 >= max ||
      shift > 3 ||
      state.blkLevel > 0) { return false; }

  if (state.src.charCodeAt(pos) !== 0x3C/* < */) { return false; }

  // TODO: (?) optimize check.

  nextLine = startLine + 1;
  while (nextLine < state.lineMax && !isEmpty(state, nextLine)) {
    nextLine++;
  }

  if (!html_tag.test(state.src.slice(pos, state.eMarks[nextLine - 1]).replace(/\n/g,' '))) {
    return false;
  }

  if (silent) { return true; }

  state.tokens.push({
    type: 'html',
    content: getLines(state, startLine, nextLine, 0, true)
  });

  state.line = nextLine;
  return true;
};
