// Paragraph

'use strict';


var isEmpty = require('../helpers').isEmpty;
var skipEmptyLines  = require('../helpers').skipEmptyLines;


module.exports = function paragraph(state, startLine, endLine) {
  var nextLine = startLine + 1,
      rules_named = state.lexerBlock.rules_named;

  // jump line-by-line until empty one or EOF
  while (nextLine < endLine && !isEmpty(state, nextLine)) {
    // Some tags can terminate paragraph without empty line.
    // Try those tags in validation more (without tokens generation)
    if (rules_named.fences(state, nextLine, endLine, true)) { break; }
    if (rules_named.hr(state, nextLine, endLine, true)) { break; }
    if (rules_named.heading(state, nextLine, endLine, true)) { break; }
    if (rules_named.lheading(state, nextLine, endLine, true)) { break; }
    if (rules_named.blockquote(state, nextLine, endLine, true)) { break; }
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

  state.line = skipEmptyLines(state, nextLine);
  return true;
};
