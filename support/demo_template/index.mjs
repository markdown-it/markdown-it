/* eslint-env browser */
/* global $, _ */

import * as mdurl from 'mdurl'
import hljs from 'highlight.js'

// plugins
import md_abbr from 'markdown-it-abbr'
import md_container from 'markdown-it-container'
import md_deflist from 'markdown-it-deflist'
import { full as md_emoji } from 'markdown-it-emoji'
import md_footnote from 'markdown-it-footnote'
import md_ins from 'markdown-it-ins'
import md_mark from 'markdown-it-mark'
import md_sub from 'markdown-it-sub'
import md_sup from 'markdown-it-sup'

let mdHtml, mdSrc, permalink, scrollMap

const defaults = {
  // Enable HTML tags in source
  html: false,

  // Use '/' to close single tags (<br />)
  xhtmlOut: false,

  // Convert '\n' in paragraphs into <br>
  breaks: false,

  // CSS language prefix for fenced blocks
  langPrefix: 'language-',

  // autoconvert URL-like texts to links
  linkify: true,

  // Enable smartypants and other sweet transforms
  typographer: true,

  // options below are for demo only
  _highlight: true,
  _strict: false,
  _view: 'html' // html / src / debug
}

defaults.highlight = function (str, lang) {
  const esc = mdHtml.utils.escapeHtml

  try {
    if (!defaults._highlight) {
      throw new Error('highlighting disabled')
    }

    if (lang && lang !== 'auto' && hljs.getLanguage(lang)) {
      return '<pre class="hljs language-' + esc(lang.toLowerCase()) + '"><code>' +
             hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
             '</code></pre>'
    } else if (lang === 'auto') {
      const result = hljs.highlightAuto(str)

      /* eslint-disable no-console */
      console.log('highlight language: ' + result.language + ', relevance: ' + result.relevance)

      return '<pre class="hljs language-' + esc(result.language) + '"><code>' +
             result.value +
             '</code></pre>'
    }
  } catch (__) { /**/ }

  return '<pre><code class="hljs">' + esc(str) + '</code></pre>'
}

function setOptionClass (name, val) {
  if (val) {
    $('body').addClass('opt_' + name)
  } else {
    $('body').removeClass('opt_' + name)
  }
}

function setResultView (val) {
  $('body').removeClass('result-as-html')
  $('body').removeClass('result-as-src')
  $('body').removeClass('result-as-debug')
  $('body').addClass('result-as-' + val)
  defaults._view = val
}

function mdInit () {
  if (defaults._strict) {
    mdHtml = window.markdownit('commonmark')
    mdSrc = window.markdownit('commonmark')
  } else {
    mdHtml = window.markdownit(defaults)
      .use(md_abbr)
      .use(md_container, 'warning')
      .use(md_deflist)
      .use(md_emoji)
      .use(md_footnote)
      .use(md_ins)
      .use(md_mark)
      .use(md_sub)
      .use(md_sup)
    mdSrc = window.markdownit(defaults)
      .use(md_abbr)
      .use(md_container, 'warning')
      .use(md_deflist)
      .use(md_emoji)
      .use(md_footnote)
      .use(md_ins)
      .use(md_mark)
      .use(md_sub)
      .use(md_sup)
  }

  // Beautify output of parser for html content
  mdHtml.renderer.rules.table_open = function () {
    return '<table class="table table-striped">\n'
  }
  // Replace emoji codes with images
  mdHtml.renderer.rules.emoji = function (token, idx) {
    return window.twemoji.parse(token[idx].content)
  }

  //
  // Inject line numbers for sync scroll. Notes:
  //
  // - We track only headings and paragraphs on first level. That's enough.
  // - Footnotes content causes jumps. Level limit filter it automatically.
  function injectLineNumbers (tokens, idx, options, env, slf) {
    let line
    if (tokens[idx].map && tokens[idx].level === 0) {
      line = tokens[idx].map[0]
      tokens[idx].attrJoin('class', 'line')
      tokens[idx].attrSet('data-line', String(line))
    }
    return slf.renderToken(tokens, idx, options, env, slf)
  }

  mdHtml.renderer.rules.paragraph_open = mdHtml.renderer.rules.heading_open = injectLineNumbers
}

function setHighlightedlContent (selector, content, lang) {
  if (window.hljs) {
    $(selector).html(window.hljs.highlight(content, { language: lang }).value)
  } else {
    $(selector).text(content)
  }
}

function updateResult () {
  const source = $('.source').val()

  // Update only active view to avoid slowdowns
  // (debug & src view with highlighting are a bit slow)
  if (defaults._view === 'src') {
    setHighlightedlContent('.result-src-content', mdSrc.render(source), 'html')
  } else if (defaults._view === 'debug') {
    setHighlightedlContent(
      '.result-debug-content',
      JSON.stringify(mdSrc.parse(source, { references: {} }), null, 2),
      'json'
    )
  } else { /* defaults._view === 'html' */
    $('.result-html').html(mdHtml.render(source))
  }

  // reset lines mapping cache on content update
  scrollMap = null

  try {
    if (source) {
      // serialize state - source and options
      permalink.href = '#md3=' + mdurl.encode(JSON.stringify({
        source,
        defaults: _.omit(defaults, 'highlight')
      }), '-_.!~', false)
    } else {
      permalink.href = ''
    }
  } catch (__) {
    permalink.href = ''
  }
}

// Build offsets for each line (lines can be wrapped)
// That's a bit dirty to process each line everytime, but ok for demo.
// Optimizations are required only for big texts.
function buildScrollMap () {
  const textarea = $('.source')

  const sourceLikeDiv = $('<div />').css({
    position: 'absolute',
    visibility: 'hidden',
    height: 'auto',
    width: textarea[0].clientWidth,
    'font-size': textarea.css('font-size'),
    'font-family': textarea.css('font-family'),
    'line-height': textarea.css('line-height'),
    'white-space': textarea.css('white-space')
  }).appendTo('body')

  const offset = $('.result-html').scrollTop() - $('.result-html').offset().top
  const _scrollMap = []
  const nonEmptyList = []
  const lineHeightMap = []

  let acc = 0
  textarea.val().split('\n').forEach(function (str) {
    lineHeightMap.push(acc)

    if (str.length === 0) {
      acc++
      return
    }

    sourceLikeDiv.text(str)
    const h = parseFloat(sourceLikeDiv.css('height'))
    const lh = parseFloat(sourceLikeDiv.css('line-height'))
    acc += Math.round(h / lh)
  })
  sourceLikeDiv.remove()
  lineHeightMap.push(acc)
  const linesCount = acc

  for (let i = 0; i < linesCount; i++) { _scrollMap.push(-1) }

  nonEmptyList.push(0)
  _scrollMap[0] = 0

  $('.line').each(function (n, el) {
    const $el = $(el)
    let t = $el.data('line')
    if (t === '') { return }
    t = lineHeightMap[t]
    if (t !== 0) { nonEmptyList.push(t) }
    _scrollMap[t] = Math.round($el.offset().top + offset)
  })

  nonEmptyList.push(linesCount)
  _scrollMap[linesCount] = $('.result-html')[0].scrollHeight

  let pos = 0
  for (let i = 1; i < linesCount; i++) {
    if (_scrollMap[i] !== -1) {
      pos++
      continue
    }

    const a = nonEmptyList[pos]
    const b = nonEmptyList[pos + 1]
    _scrollMap[i] = Math.round((_scrollMap[b] * (i - a) + _scrollMap[a] * (b - i)) / (b - a))
  }

  return _scrollMap
}

// Synchronize scroll position from source to result
const syncResultScroll = _.debounce(function () {
  const textarea   = $('.source')
  const lineHeight = parseFloat(textarea.css('line-height'))

  const lineNo = Math.floor(textarea.scrollTop() / lineHeight)
  if (!scrollMap) { scrollMap = buildScrollMap() }
  const posTo = scrollMap[lineNo]
  $('.result-html').stop(true).animate({
    scrollTop: posTo
  }, 100, 'linear')
}, 50, { maxWait: 50 })

// Synchronize scroll position from result to source
const syncSrcScroll = _.debounce(function () {
  const resultHtml = $('.result-html')
  const scrollTop  = resultHtml.scrollTop()
  const textarea   = $('.source')
  const lineHeight = parseFloat(textarea.css('line-height'))

  if (!scrollMap) { scrollMap = buildScrollMap() }

  const lines = Object.keys(scrollMap)

  if (lines.length < 1) {
    return
  }

  let line = lines[0]

  for (let i = 1; i < lines.length; i++) {
    if (scrollMap[lines[i]] < scrollTop) {
      line = lines[i]
      continue
    }

    break
  }

  textarea.stop(true).animate({
    scrollTop: lineHeight * line
  }, 100, 'linear')
}, 50, { maxWait: 50 })

function loadPermalink () {
  if (!location.hash) { return }

  let cfg

  try {
    if (/^#md3=/.test(location.hash)) {
      cfg = JSON.parse(mdurl.decode(location.hash.slice(5), mdurl.decode.componentChars))
    } else if (/^#md64=/.test(location.hash)) {
      cfg = JSON.parse(window.atob(location.hash.slice(6)))
    } else if (/^#md=/.test(location.hash)) {
      cfg = JSON.parse(decodeURIComponent(location.hash.slice(4)))
    } else {
      return
    }

    if (_.isString(cfg.source)) {
      $('.source').val(cfg.source)
    }
  } catch (__) {
    return
  }

  const opts = _.isObject(cfg.defaults) ? cfg.defaults : {}

  // copy config to defaults, but only if key exists
  // and value has the same type
  _.forOwn(opts, function (val, key) {
    if (!_.has(defaults, key)) { return }

    // Legacy, for old links
    if (key === '_src') {
      defaults._view = val ? 'src' : 'html'
      return
    }

    if ((_.isBoolean(defaults[key]) && _.isBoolean(val)) ||
        (_.isString(defaults[key]) && _.isString(val))) {
      defaults[key] = val
    }
  })

  // sanitize for sure
  if (['html', 'src', 'debug'].indexOf(defaults._view) === -1) {
    defaults._view = 'html'
  }
}

// Init on page load
//
$(function () {
  // highlight snippet
  if (window.hljs) {
    $('pre.code-sample code').each(function (i, block) {
      window.hljs.highlightBlock(block)
    })
  }

  loadPermalink()

  // Activate tooltips
  $('._tip').tooltip({ container: 'body' })

  // Set default option values and option listeners
  _.forOwn(defaults, function (val, key) {
    if (key === 'highlight') { return }

    const el = document.getElementById(key)

    if (!el) { return }

    const $el = $(el)

    if (_.isBoolean(val)) {
      $el.prop('checked', val)
      $el.on('change', function () {
        const value = Boolean($el.prop('checked'))
        setOptionClass(key, value)
        defaults[key] = value
        mdInit()
        updateResult()
      })
      setOptionClass(key, val)
    } else {
      $(el).val(val)
      $el.on('change update keyup', function () {
        defaults[key] = String($(el).val())
        mdInit()
        updateResult()
      })
    }
  })

  setResultView(defaults._view)

  mdInit()
  permalink = document.getElementById('permalink')

  // Setup listeners
  $('.source').on('keyup paste cut mouseup', _.debounce(updateResult, 300, { maxWait: 500 }))

  $('.source').on('touchstart mouseover', function () {
    $('.result-html').off('scroll')
    $('.source').on('scroll', syncResultScroll)
  })

  $('.result-html').on('touchstart mouseover', function () {
    $('.source').off('scroll')
    $('.result-html').on('scroll', syncSrcScroll)
  })

  $('.source-clear').on('click', function (event) {
    $('.source').val('')
    updateResult()
    event.preventDefault()
  })

  $(document).on('click', '[data-result-as]', function (event) {
    const view = $(this).data('resultAs')
    if (view) {
      setResultView(view)
      // only to update permalink
      updateResult()
      event.preventDefault()
    }
  })

  // Need to recalculate line positions on window resize
  $(window).on('resize', function () {
    scrollMap = null
  })

  updateResult()
})
