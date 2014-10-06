// Paragraph

'use strict';


var isEmpty  = require('../helpers').isEmpty;
var getLines = require('../helpers').getLines;
var parseRef = require('../parser_ref');


module.exports = function paragraph(state, startLine/*, endLine*/) {
  var endLine, content, pos, terminate, i, l,
      nextLine = startLine + 1,
      terminatorRules = state.parser._rulesParagraphTerm;

  endLine = state.lineMax;

  // jump line-by-line until empty one or EOF
  for (; nextLine < endLine && !isEmpty(state, nextLine); nextLine++) {
    // this would be a code block normally, but after paragraph
    // it's considered a lazy continuation regardless of what's there
    if (state.tShift[nextLine] - state.blkIndent > 3) { continue; }

    // Some tags can terminate paragraph without empty line.
    terminate = false;
    for (i = 0, l = terminatorRules.length; i < l; i++) {
      if (terminatorRules[i](state, nextLine, endLine, true)) {
        terminate = true;
        break;
      }
    }
    if (terminate) { break; }
  }

  content = getLines(state, startLine, nextLine, state.blkIndent, false).trim();

  while (content.length) {
    pos = parseRef(content, state.parser.inline, state.options, state.env);
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
