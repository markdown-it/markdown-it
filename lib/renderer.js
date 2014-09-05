'use strict';


function escapeHTML(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function joinLines(state, begin, end) {
 return state.src.slice(
    state.bMarks[begin],
    end < state.lineMax ? state.bMarks[end] : state.src.length
  );
}

var rules = {};


rules.code = function (state, token) {
  // TODO: check if we need variable indent cut
  var lines = joinLines(state, token.startLine, token.endLine).replace(/^ {4}/gm, '');

  state.result += '<pre><code>' + escapeHTML(lines) + '</code></pre>\n';
};

rules.hr = function (state, token) {
  state.result += '<hr>\n';
};


rules.paragraph_open = function (state, token) {
  state.result += '<p>';
};
rules.paragraph_close = function (state, token) {
  state.result += '</p>\n';
};


rules.text = function (state, token) {
  state.result += escapeHTML(state.src.slice(token.begin, token.end));
};


// TODO: Stub. Do extendable.
function Renderer() {
}

Renderer.prototype.render = function (state) {
  var i, len, rule,
      tokens = state.tokens;

  for (i = 0, len = tokens.length; i < len; i++) {
    rule = rules[tokens[i].type];

    // TODO: temporary check
    if (!rule) {
      throw Error('Renderer error: unknown token ' + tokens[i].type);
    }

    rule(state, tokens[i]);
  }

  return state.result;
};

module.exports = Renderer;