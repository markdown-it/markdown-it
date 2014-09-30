$(function() {
  // highlight snippets
  $('pre.code-sample code').each(function(i, block) {
    hljs.highlightBlock(block);
  });
});

var md = new window.Remarkable({
  html: true,
  xhtml: true,
  breaks: false,
  langprefix: 'language-'
});

md.renderer.rules.table_open = function () {
  return '<table class="table table-striped">\n';
}


function updateResult() {
  var result = md.render($('#demo1 .source').val());
  $('#demo1 .result').html(result);
  $('#demo1 .result-text-data').text(result);
}

$('#demo1 .source').on('keyup paste cut mouseup', updateResult);
$('#demo1 .mode').on('click', function (event) {
  $('#demo1').toggleClass('result-as-text');
  event.preventDefault();
});

updateResult();