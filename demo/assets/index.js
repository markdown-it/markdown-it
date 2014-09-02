hljs.initHighlightingOnLoad();

$(function() {
  // highlight snippets
  $('pre code').each(function(i, block) {
    hljs.highlightBlock(block);
  });
});