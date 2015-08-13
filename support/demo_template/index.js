'use strict';

/*eslint-env browser*/
/*global $, _*/

var mdurl = require('mdurl');

var mdHtml, mdSrc, permalink, scrollMap;

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
  if (!defaults._highlight || !window.hljs) { return ''; }

  var hljs = window.hljs;
  if (lang && hljs.getLanguage(lang)) {
    try {
      return hljs.highlight(lang, str).value;
    } catch (__) { /**/ }
  }

  try {
    return hljs.highlightAuto(str).value;
  } catch (__) { /**/ }

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
    mdHtml = window.markdownit('commonmark');
    mdSrc = window.markdownit('commonmark');
  } else {
    mdHtml = window.markdownit(defaults)
                .use(require('markdown-it-abbr'))
                .use(require('markdown-it-container'), 'warning')
                .use(require('markdown-it-deflist'))
                .use(require('markdown-it-emoji'))
                .use(require('markdown-it-footnote'))
                .use(require('markdown-it-ins'))
                .use(require('markdown-it-mark'))
                .use(require('markdown-it-sub'))
                .use(require('markdown-it-sup'));
    mdSrc = window.markdownit(defaults)
                .use(require('markdown-it-abbr'))
                .use(require('markdown-it-container'), 'warning')
                .use(require('markdown-it-deflist'))
                .use(require('markdown-it-emoji'))
                .use(require('markdown-it-footnote'))
                .use(require('markdown-it-ins'))
                .use(require('markdown-it-mark'))
                .use(require('markdown-it-sub'))
                .use(require('markdown-it-sup'));
  }

  // Beautify output of parser for html content
  mdHtml.renderer.rules.table_open = function () {
    return '<table class="table table-striped">\n';
  };
  // Replace emoji codes with images
  mdHtml.renderer.rules.emoji = function(token, idx) {
    return window.twemoji.parse(token[idx].content);
  };

  //
  // Inject line numbers for sync scroll. Notes:
  //
  // - We track only headings and paragraphs on first level. That's enough.
  // - Footnotes content causes jumps. Level limit filter it automatically.
  function injectLineNumbers(tokens, idx, options, env, slf) {
    var line;
    if (tokens[idx].map && tokens[idx].level === 0) {
      line = tokens[idx].map[0];
      tokens[idx].attrPush([ 'class', 'line' ]);
      tokens[idx].attrPush([ 'data-line', String(line) ]);
    }
    return slf.renderToken(tokens, idx, options, env, slf);
  }

  mdHtml.renderer.rules.paragraph_open = mdHtml.renderer.rules.heading_open = injectLineNumbers;
}

function setHighlightedlContent(selector, content, lang) {
  if (window.hljs) {
    $(selector).html(window.hljs.highlight(lang, content).value);
  } else {
    $(selector).text(content);
  }
}

function updateResult() {
  var source = $('.source').val();

  // Update only active view to avoid slowdowns
  // (debug & src view with highlighting are a bit slow)
  if (defaults._view === 'src') {
    setHighlightedlContent('.result-src-content', mdSrc.render(source), 'html');

  } else if (defaults._view === 'debug') {
    setHighlightedlContent(
      '.result-debug-content',
      JSON.stringify(mdSrc.parse(source, { references: {} }), null, 2),
      'json'
    );

  } else { /*defaults._view === 'html'*/
    $('.result-html').html(mdHtml.render(source));
  }

  // reset lines mapping cache on content update
  scrollMap = null;

  try {
    if (source) {
      // serialize state - source and options
      permalink.href = '#md3=' + mdurl.encode(JSON.stringify({
        source: source,
        defaults: _.omit(defaults, 'highlight')
      }), '-_.!~', false);
    } else {
      permalink.href = '';
    }
  } catch (__) {
    permalink.href = '';
  }
}

// Build offsets for each line (lines can be wrapped)
// That's a bit dirty to process each line everytime, but ok for demo.
// Optimizations are required only for big texts.
function buildScrollMap() {
  var i, offset, nonEmptyList, pos, a, b, lineHeightMap, linesCount,
      acc, sourceLikeDiv, textarea = $('.source'),
      _scrollMap;

  sourceLikeDiv = $('<div />').css({
    position: 'absolute',
    visibility: 'hidden',
    height: 'auto',
    width: textarea[0].clientWidth,
    'font-size': textarea.css('font-size'),
    'font-family': textarea.css('font-family'),
    'line-height': textarea.css('line-height'),
    'white-space': textarea.css('white-space')
  }).appendTo('body');

  offset = $('.result-html').scrollTop() - $('.result-html').offset().top;
  _scrollMap = [];
  nonEmptyList = [];
  lineHeightMap = [];

  acc = 0;
  textarea.val().split('\n').forEach(function(str) {
    var h, lh;

    lineHeightMap.push(acc);

    if (str.length === 0) {
      acc++;
      return;
    }

    sourceLikeDiv.text(str);
    h = parseFloat(sourceLikeDiv.css('height'));
    lh = parseFloat(sourceLikeDiv.css('line-height'));
    acc += Math.round(h / lh);
  });
  sourceLikeDiv.remove();
  lineHeightMap.push(acc);
  linesCount = acc;

  for (i = 0; i < linesCount; i++) { _scrollMap.push(-1); }

  nonEmptyList.push(0);
  _scrollMap[0] = 0;

  $('.line').each(function(n, el) {
    var $el = $(el), t = $el.data('line');
    if (t === '') { return; }
    t = lineHeightMap[t];
    if (t !== 0) { nonEmptyList.push(t); }
    _scrollMap[t] = Math.round($el.offset().top + offset);
  });

  nonEmptyList.push(linesCount);
  _scrollMap[linesCount] = $('.result-html')[0].scrollHeight;

  pos = 0;
  for (i = 1; i < linesCount; i++) {
    if (_scrollMap[i] !== -1) {
      pos++;
      continue;
    }

    a = nonEmptyList[pos];
    b = nonEmptyList[pos + 1];
    _scrollMap[i] = Math.round((_scrollMap[b] * (i - a) + _scrollMap[a] * (b - i)) / (b - a));
  }

  return _scrollMap;
}

// Synchronize scroll position from source to result
var syncResultScroll = _.debounce(function () {
  var textarea   = $('.source'),
      lineHeight = parseFloat(textarea.css('line-height')),
      lineNo, posTo;

  lineNo = Math.floor(textarea.scrollTop() / lineHeight);
  if (!scrollMap) { scrollMap = buildScrollMap(); }
  posTo = scrollMap[lineNo];
  $('.result-html').stop(true).animate({
    scrollTop: posTo
  }, 100, 'linear');
}, 50, { maxWait: 50 });

// Synchronize scroll position from result to source
var syncSrcScroll = _.debounce(function () {
  var resultHtml = $('.result-html'),
      scrollTop  = resultHtml.scrollTop(),
      textarea   = $('.source'),
      lineHeight = parseFloat(textarea.css('line-height')),
      lines,
      i,
      line;

  if (!scrollMap) { scrollMap = buildScrollMap(); }

  lines = Object.keys(scrollMap);

  if (lines.length < 1) {
    return;
  }

  line = lines[0];

  for (i = 1; i < lines.length; i++) {
    if (scrollMap[lines[i]] < scrollTop) {
      line = lines[i];
      continue;
    }

    break;
  }

  textarea.stop(true).animate({
    scrollTop: lineHeight * line
  }, 100, 'linear');
}, 50, { maxWait: 50 });


function loadPermalink() {

  if (!location.hash) { return; }

  var cfg, opts;

  try {

    if (/^#md3=/.test(location.hash)) {
      cfg = JSON.parse(mdurl.decode(location.hash.slice(5), mdurl.decode.componentChars));

    } else if (/^#md64=/.test(location.hash)) {
      cfg = JSON.parse(window.atob(location.hash.slice(6)));

    } else if (/^#md=/.test(location.hash)) {
      cfg = JSON.parse(decodeURIComponent(location.hash.slice(4)));

    } else {
      return;
    }

    if (_.isString(cfg.source)) {
      $('.source').val(cfg.source);
    }
  } catch (__) {
    return;
  }

  opts = _.isObject(cfg.defaults) ? cfg.defaults : {};

  // copy config to defaults, but only if key exists
  // and value has the same type
  _.forOwn(opts, function (val, key) {
    if (!_.has(defaults, key)) { return; }

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
}


//////////////////////////////////////////////////////////////////////////////
// Init on page load
//
$(function() {
  // highlight snippet
  if (window.hljs) {
    $('pre.code-sample code').each(function(i, block) {
      window.hljs.highlightBlock(block);
    });
  }

  loadPermalink();

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
  $('.source').on('keyup paste cut mouseup', _.debounce(updateResult, 300, { maxWait: 500 }));

  $('.source').on('touchstart mouseover', function () {
    $('.result-html').off('scroll');
    $('.source').on('scroll', syncResultScroll);
  });

  $('.result-html').on('touchstart mouseover', function () {
    $('.source').off('scroll');
    $('.result-html').on('scroll', syncSrcScroll);
  });

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

  // Need to recalculate line positions on window resize
  $(window).on('resize', function () {
    scrollMap = null;
  });

  updateResult();
});
