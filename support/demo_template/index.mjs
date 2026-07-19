import markdownit from '../../src/index.ts'
import * as mdurl from 'mdurl'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.min.css'
import sample from './sample.md?raw'

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
let permalinkLoaded = false
const scrollAnimations = new WeakMap()
const hasOwn = Object.prototype.hasOwnProperty

function qs (selector) {
  return document.querySelector(selector)
}

function qsa (selector) {
  return Array.from(document.querySelectorAll(selector))
}

function isObject (val) {
  return val !== null && typeof val === 'object' && !Array.isArray(val)
}

function debounce (fn, wait, options = {}) {
  let timeoutId
  let maxTimeoutId
  let lastArgs
  let lastThis

  function invoke () {
    clearTimeout(timeoutId)
    clearTimeout(maxTimeoutId)
    timeoutId = null
    maxTimeoutId = null
    fn.apply(lastThis, lastArgs)
    lastArgs = null
    lastThis = null
  }

  return function (...args) {
    lastArgs = args
    lastThis = this

    clearTimeout(timeoutId)
    timeoutId = setTimeout(invoke, wait)

    if (options.maxWait && !maxTimeoutId) {
      maxTimeoutId = setTimeout(invoke, options.maxWait)
    }
  }
}

function setScrollTop (el, top, duration) {
  cancelAnimationFrame(scrollAnimations.get(el))

  const from = el.scrollTop
  const diff = top - from
  const start = window.performance.now()

  function step (time) {
    const progress = Math.min((time - start) / duration, 1)
    el.scrollTop = from + diff * progress

    if (progress < 1) {
      scrollAnimations.set(el, requestAnimationFrame(step))
    }
  }

  scrollAnimations.set(el, requestAnimationFrame(step))
}

function permalinkDefaults () {
  const result = {}

  for (const [key, val] of Object.entries(defaults)) {
    if (key !== 'highlight') {
      result[key] = val
    }
  }

  return result
}

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
    document.body.classList.add('opt_' + name)
  } else {
    document.body.classList.remove('opt_' + name)
  }
}

function setResultView (val) {
  document.body.classList.remove('result-as-html')
  document.body.classList.remove('result-as-src')
  document.body.classList.remove('result-as-debug')
  document.body.classList.add('result-as-' + val)
  defaults._view = val
}

function mdInit () {
  if (defaults._strict) {
    mdHtml = markdownit('commonmark')
    mdSrc = markdownit('commonmark')
  } else {
    mdHtml = markdownit(defaults)
      .use(md_abbr)
      .use(md_container, 'warning')
      .use(md_deflist)
      .use(md_emoji)
      .use(md_footnote)
      .use(md_ins)
      .use(md_mark)
      .use(md_sub)
      .use(md_sup)
    mdSrc = markdownit(defaults)
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

function updateResult () {
  const source = qs('.source').value

  // Update only active view to avoid slowdowns
  // (debug & src views can be slow for big sources)
  if (defaults._view === 'src') {
    qs('.result-src-content').textContent = mdSrc.render(source)
  } else if (defaults._view === 'debug') {
    qs('.result-debug-content').textContent = JSON.stringify(mdSrc.parse(source, { references: {} }), null, 2)
  } else { /* defaults._view === 'html' */
    qs('.result-html').innerHTML = mdHtml.render(source)
  }

  // reset lines mapping cache on content update
  scrollMap = null

  try {
    if (source) {
      // serialize state - source and options
      permalink.href = '#md3=' + mdurl.encode(JSON.stringify({
        source,
        defaults: permalinkDefaults()
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
  const textarea = qs('.source')
  const resultHtml = qs('.result-html')
  const textareaStyle = getComputedStyle(textarea)
  const sourceLikeDiv = document.createElement('div')

  Object.assign(sourceLikeDiv.style, {
    position: 'absolute',
    visibility: 'hidden',
    height: 'auto',
    width: textarea.clientWidth + 'px',
    fontSize: textareaStyle.fontSize,
    fontFamily: textareaStyle.fontFamily,
    lineHeight: textareaStyle.lineHeight,
    whiteSpace: textareaStyle.whiteSpace
  })
  document.body.appendChild(sourceLikeDiv)

  const resultTop = resultHtml.getBoundingClientRect().top
  const _scrollMap = []
  const nonEmptyList = []
  const lineHeightMap = []

  let acc = 0
  textarea.value.split('\n').forEach(function (str) {
    lineHeightMap.push(acc)

    if (str.length === 0) {
      acc++
      return
    }

    sourceLikeDiv.textContent = str
    const h = parseFloat(getComputedStyle(sourceLikeDiv).height)
    const lh = parseFloat(getComputedStyle(sourceLikeDiv).lineHeight)
    acc += Math.round(h / lh)
  })
  sourceLikeDiv.remove()
  lineHeightMap.push(acc)
  const linesCount = acc

  for (let i = 0; i < linesCount; i++) { _scrollMap.push(-1) }

  nonEmptyList.push(0)
  _scrollMap[0] = 0

  qsa('.line').forEach(function (el) {
    let t = el.dataset.line
    if (t === '') { return }
    t = lineHeightMap[t]
    if (t !== 0) { nonEmptyList.push(t) }
    _scrollMap[t] = Math.round(el.getBoundingClientRect().top - resultTop + resultHtml.scrollTop)
  })

  nonEmptyList.push(linesCount)
  _scrollMap[linesCount] = resultHtml.scrollHeight

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
const syncResultScroll = debounce(function () {
  const textarea = qs('.source')
  const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight)

  const lineNo = Math.floor(textarea.scrollTop / lineHeight)
  if (!scrollMap) { scrollMap = buildScrollMap() }
  const posTo = scrollMap[lineNo]
  setScrollTop(qs('.result-html'), posTo, 100)
}, 50, { maxWait: 50 })

// Synchronize scroll position from result to source
const syncSrcScroll = debounce(function () {
  const resultHtml = qs('.result-html')
  const scrollTop = resultHtml.scrollTop
  const textarea = qs('.source')
  const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight)

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

  setScrollTop(textarea, lineHeight * line, 100)
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

    if (typeof cfg.source === 'string') {
      qs('.source').value = cfg.source
      permalinkLoaded = true
    }
  } catch (__) {
    return
  }

  const opts = isObject(cfg.defaults) ? cfg.defaults : {}

  // copy config to defaults, but only if key exists
  // and value has the same type
  Object.entries(opts).forEach(function ([key, val]) {
    if (!hasOwn.call(defaults, key)) { return }

    // Legacy, for old links
    if (key === '_src') {
      defaults._view = val ? 'src' : 'html'
      return
    }

    if ((typeof defaults[key] === 'boolean' && typeof val === 'boolean') ||
        (typeof defaults[key] === 'string' && typeof val === 'string')) {
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
function init () {
  // highlight snippet
  qsa('pre.code-sample code').forEach(block => hljs.highlightElement(block))

  loadPermalink()
  if (!permalinkLoaded) {
    qs('.source').value = sample
  }

  // Set default option values and option listeners
  Object.entries(defaults).forEach(function ([key, val]) {
    if (key === 'highlight') { return }

    const el = document.getElementById(key)

    if (!el) { return }

    if (typeof val === 'boolean') {
      el.checked = val
      el.addEventListener('change', function () {
        const value = Boolean(el.checked)
        setOptionClass(key, value)
        defaults[key] = value
        mdInit()
        updateResult()
      })
      setOptionClass(key, val)
    } else {
      el.value = val
      ;['change', 'update', 'keyup'].forEach(function (eventName) {
        el.addEventListener(eventName, function () {
          defaults[key] = String(el.value)
          mdInit()
          updateResult()
        })
      })
    }
  })

  setResultView(defaults._view)

  mdInit()
  permalink = document.getElementById('permalink')

  // Setup listeners
  const source = qs('.source')
  const resultHtml = qs('.result-html')
  const debouncedUpdateResult = debounce(updateResult, 300, { maxWait: 500 })

  ;['keyup', 'paste', 'cut', 'mouseup'].forEach(function (eventName) {
    source.addEventListener(eventName, debouncedUpdateResult)
  })

  ;['touchstart', 'mouseover'].forEach(function (eventName) {
    source.addEventListener(eventName, function () {
      resultHtml.removeEventListener('scroll', syncSrcScroll)
      source.addEventListener('scroll', syncResultScroll)
    })

    resultHtml.addEventListener(eventName, function () {
      source.removeEventListener('scroll', syncResultScroll)
      resultHtml.addEventListener('scroll', syncSrcScroll)
    })
  })

  qs('.source-clear').addEventListener('click', function (event) {
    source.value = ''
    updateResult()
    event.preventDefault()
  })

  document.addEventListener('click', function (event) {
    const el = event.target.closest('[data-result-as]')
    if (!el) { return }

    const view = el.dataset.resultAs
    if (view) {
      setResultView(view)
      // only to update permalink
      updateResult()
      event.preventDefault()
    }
  })

  // Need to recalculate line positions on window resize
  window.addEventListener('resize', function () {
    scrollMap = null
  })

  updateResult()
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
