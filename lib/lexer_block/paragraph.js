// Paragraph

'use strict';


var isEmpty = require('../helpers').isEmpty;


module.exports = function paragraph(state, startLine/*, endLine*/) {
  var endLine,
      nextLine = startLine + 1,
      rules_named = state.lexerBlock.rules_named;

  endLine = state.lineMax;

  // jump line-by-line until empty one or EOF
  while (nextLine < endLine && !isEmpty(state, nextLine)) {
    // Some tags can terminate paragraph without empty line.
    if (rules_named.fences(state, nextLine, endLine, true)) { break; }
    if (rules_named.hr(state, nextLine, endLine, true)) { break; }
    if (rules_named.list(state, nextLine, endLine, true)) { break; }
    if (rules_named.heading(state, nextLine, endLine, true)) { break; }
    // setex header can't interrupt paragraph
    // if (rules_named.lheading(state, nextLine, endLine, true)) { break; }
    if (rules_named.blockquote(state, nextLine, endLine, true)) { break; }
    if (rules_named.table(state, nextLine, endLine, true)) { break; }
    //if (rules_named.tag(state, nextLine, endLine, true)) { break; }
    //if (rules_named.def(state, nextLine, endLine, true)) { break; }
    nextLine++;
  }

  state.tokens.push({ type: 'paragraph_open' });
  state.lexerInline.tokenize(
    state,
    state.bMarks[startLine],
    state.eMarks[nextLine - 1]
  );
  state.tokens.push({ type: 'paragraph_close' });

  state.line = nextLine;
  return true;
};
