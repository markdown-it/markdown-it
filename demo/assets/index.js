(function () {
  'use strict';

  var mdHtml, mdSrc, permalink;

  var defaults = {
    html:         false,        // Enable HTML tags in source
    xhtmlOut:     false,        // Use '/' to close single tags (<br />)
    breaks:       false,        // Convert '\n' in paragraphs into <br>
    langPrefix:   'language-',  // CSS language prefix for fenced blocks
    linkify:      true,         // autoconvert URL-like texts to links
    typographer:  true,         // Enable smartypants and other sweet transforms

    // options below are for demo only
    _highlight: true,
    _strict: false,
    _view: 'html'               // html / src / debug
  };

  defaults.highlight = function (str, lang) {
    if (!defaults._highlight) { return ''; }

    var hljs = window.hljs;
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (__) {}
    }

    try {
      return hljs.highlightAuto(str).value;
    } catch (__) {}

    return '';
  };

  function setOptionClass(name, val) {
    if (val) {
      $('body').addClass('opt_' + name);
    } else {
      $('body').removeClass('opt_' + name);
    }
  }

  function setResultView(val) {
    $('body').removeClass('result-as-html');
    $('body').removeClass('result-as-src');
    $('body').removeClass('result-as-debug');
    $('body').addClass('result-as-' + val);
    defaults._view = val;
  }

  function mdInit() {
    if (defaults._strict) {
      mdHtml = new window.Remarkable('commonmark');
      mdSrc = new window.Remarkable('commonmark');
    } else {
      mdHtml = new window.Remarkable('full', defaults);
      mdSrc = new window.Remarkable('full', defaults);
    }

    // Beautify output of parser for html content
    mdHtml.renderer.rules.table_open = function () {
      return '<table class="table table-striped">\n';
    };
  }

  function updateResult() {
    var source = $('.source').val();

    $('.result-html').html(mdHtml.render(source));
    $('.result-src-content').html(window.hljs.highlight('html', mdSrc.render(source)).value);

    var dump = JSON.stringify(mdSrc.parse(source, { references: {} }), null, 2);
    $('.result-debug-content').html(window.hljs.highlight('json', dump).value);

    try {
      if (source) {
        // serialize state - source and options
        permalink.href = '#md64=' + window.btoa(JSON.stringify({
          source: source,
          defaults: _.omit(defaults, 'highlight')
        }));
      } else {
        permalink.href = '';
      }
    } catch (__) {
      permalink.href = '';
    }
  }


  $(function() {
    // highlight snippet
    $('pre.code-sample code').each(function(i, block) {
      window.hljs.highlightBlock(block);
    });

    // Restore content if opened by permalink
    if (location.hash && /^(#md=|#md64=)/.test(location.hash)) {
      try {
        var cfg;

        if (/^#md64=/.test(location.hash)) {
          cfg = JSON.parse(window.atob(location.hash.slice(6)));
        } else {
          // Legacy mode for old links. Those become broken in github posts,
          // so we switched to base64 encoding.
          cfg = JSON.parse(decodeURIComponent(location.hash.slice(4)));
        }

        if (_.isString(cfg.source)) {
          $('.source').val(cfg.source);
        }

        var opts = _.isObject(cfg.defaults) ? cfg.defaults : {};

        // copy config to defaults, but only if key exists
        // and value has the same type
        _.forOwn(opts, function (val, key) {
          if (!defaults.hasOwnProperty(key)) { return; }

          // Legacy, for old links
          if (key === '_src') {
            defaults._view = val ? 'src' : 'html';
            return;
          }

          if ((_.isBoolean(defaults[key]) && _.isBoolean(val)) ||
              (_.isString(defaults[key]) && _.isString(val))) {
            defaults[key] = val;
          }
        });

        // sanitize for sure
        if ([ 'html', 'src', 'debug' ].indexOf(defaults._view) === -1) {
          defaults._view = 'html';
        }
      } catch (__) {}
    }

    // Activate tooltips
    $('._tip').tooltip({ container: 'body' });

    // Set default option values and option listeners
    _.forOwn(defaults, function (val, key) {
      if (key === 'highlight') { return; }

      var el = document.getElementById(key);

      if (!el) { return; }

      var $el = $(el);

      if (_.isBoolean(val)) {
        $el.prop('checked', val);
        $el.on('change', function () {
          var value = Boolean($el.prop('checked'));
          setOptionClass(key, value);
          defaults[key] = value;
          mdInit();
          updateResult();
        });
        setOptionClass(key, val);

      } else {
        $(el).val(val);
        $el.on('change update keyup', function () {
          defaults[key] = String($(el).val());
          mdInit();
          updateResult();
        });
      }
    });

    setResultView(defaults._view);

    mdInit();
    permalink = document.getElementById('permalink');

    // Setup listeners
    $('.source').on('keyup paste cut mouseup', updateResult);

    $('.source-clear').on('click', function (event) {
      $('.source').val('');
      updateResult();
      event.preventDefault();
    });

    $(document).on('click', '[data-result-as]', function (event) {
      var view = $(this).data('resultAs');
      if (view) {
        setResultView(view);
        // only to update permalink
        updateResult();
        event.preventDefault();
      }
    });

    updateResult();
  });
})();
