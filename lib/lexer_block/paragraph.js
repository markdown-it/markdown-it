// Paragraph

'use strict';


var isEmpty = require('../helpers').isEmpty;
var getLines = require('../helpers').getLines;
var parseRef = require('../parse_ref');


module.exports = function paragraph(state, startLine/*, endLine*/) {
  var endLine, content, pos,
      nextLine = startLine + 1,
      rules_named = state.lexer.rules_named;

  endLine = state.lineMax;

  // jump line-by-line until empty one or EOF
  for (; nextLine < endLine && !isEmpty(state, nextLine); nextLine++) {
    // this would be a code block normally, but after paragraph
    // it's considered a lazy continuation regardless of what's there
    if (state.tShift[nextLine] - state.blkIndent > 3) { continue; }

    // Some tags can terminate paragraph without empty line.
    if (rules_named.fences(state, nextLine, endLine, true)) { break; }
    if (rules_named.hr(state, nextLine, endLine, true)) { break; }
    if (rules_named.list(state, nextLine, endLine, true)) { break; }
    if (rules_named.heading(state, nextLine, endLine, true)) { break; }
    // setex header can't interrupt paragraph
    // if (rules_named.lheading(state, nextLine, endLine, true)) { break; }
    if (rules_named.blockquote(state, nextLine, endLine, true)) { break; }
    if (rules_named.htmlblock(state, nextLine, endLine, true)) { break; }
    if (rules_named.table(state, nextLine, endLine, true)) { break; }
    //if (rules_named.tag(state, nextLine, endLine, true)) { break; }
    //if (rules_named.def(state, nextLine, endLine, true)) { break; }
  }

  content = getLines(state, startLine, nextLine, state.blkIndent, false).trim();

  while (content.length) {
    pos = parseRef(content, state.lexer.inline, state.options, state.env);
    if (pos < 0) { break; }
    content = content.slice(pos).trim();
  }

  if (content.length) {
    state.tokens.push({ type: 'paragraph_open', level: state.level });
    state.tokens.push({
      type: 'inline',
      content: content,
      level: state.level + 1
    });
    state.tokens.push({ type: 'paragraph_close', level: state.level });
  }

  state.line = nextLine;
  return true;
};
