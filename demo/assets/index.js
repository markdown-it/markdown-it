(function () {
  'use strict';

  var mdHtml, mdSrc, permalink;

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
    try {
      if (source) {
        permalink.href = '#md=' + encodeURIComponent(source);
      } else {
        permalink.href = '';
      }
    } catch (__) {}
  }


  $(function() {
    // highlight snippet
    $('pre.code-sample code').each(function(i, block) {
      window.hljs.highlightBlock(block);
    });

    // Restore content if opened by permalink
    if (location.hash && location.hash.toString().slice(0,4) === '#md=') {
      $('.source').val(decodeURIComponent(location.hash.slice(4)));
    }

    mdInit();

    permalink = document.getElementById('permalink');

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
