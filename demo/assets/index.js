(function () {
  'use strict';

  var mdHtml, mdSrc;

  var options = {
    html: true,
    xhtml: true,
    breaks: false,
    langprefix: 'language-'
  };

  function mdInit() {
    mdHtml = new window.Remarkable(options);
    mdSrc = new window.Remarkable(options);

    // Beautify output of parser for html content
    mdHtml.renderer.rules.table_open = function () {
      return '<table class="table table-striped">\n';
    };
  }

  function updateResult() {
    var source = $('.source').val();
    $('.result').html(mdHtml.render(source));
    $('.result-src-content').text(mdSrc.render(source));
  }


  $(function() {
    // highlight snippet
    $('pre.code-sample code').each(function(i, block) {
      window.hljs.highlightBlock(block);
    });

    mdInit();

    $('.source').on('keyup paste cut mouseup', updateResult);
    $('.source-clear').on('click', function (event) {
      $('.source').val('');
      updateResult();
      event.preventDefault();
    });
    $('.result-mode').on('click', function (event) {
      $('body').toggleClass('result-as-text');
      event.preventDefault();
    });

    updateResult();
  });
})();
