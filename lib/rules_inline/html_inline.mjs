// Process html tags

import { HTML_OPEN_CLOSE_TAG_RE } from '../common/html_re.mjs'

function isLinkOpen (str) {
  return /^<a[>\s]/i.test(str)
}
function isLinkClose (str) {
  return /^<\/a\s*>/i.test(str)
}

function isLetter (ch) {
  /* eslint no-bitwise:0 */
  const lc = ch | 0x20 // to lower case
  return (lc >= 0x61/* a */) && (lc <= 0x7a/* z */)
}

// Comment, processing instruction, declaration or CDATA: fixed opener,
// then everything up to the first terminator. Returns end position or -1.
function scanSpecial (state, pos) {
  const src = state.src
  let start
  let terminator

  if (src.startsWith('<!--', pos)) {
    if (src.startsWith('>', pos + 4)) { return pos + 5 }
    if (src.startsWith('->', pos + 4)) { return pos + 6 }
    start = pos + 4
    terminator = '-->'
  } else if (src.startsWith('<![CDATA[', pos)) {
    start = pos + 9
    terminator = ']]>'
  } else if (src.charCodeAt(pos + 1) === 0x3F/* ? */) {
    start = pos + 2
    terminator = '?>'
  } else if (isLetter(src.charCodeAt(pos + 2))) {
    start = pos + 3
    terminator = '>'
  } else {
    return -1
  }

  if (state.skipHtmlSpecial) { return -1 }

  const end = src.indexOf(terminator, start)
  if (end < 0) {
    // One flag for all constructs to keep code simple. Valid constructs after
    // an unclosed one in the same paragraph become text, that's acceptable.
    state.skipHtmlSpecial = true
    return -1
  }
  return end + terminator.length
}

export default function html_inline (state, silent) {
  if (!state.md.options.html) { return false }

  // Check start
  const max = state.posMax
  const pos = state.pos
  if (state.src.charCodeAt(pos) !== 0x3C/* < */ ||
      pos + 2 >= max) {
    return false
  }

  let end
  const ch = state.src.charCodeAt(pos + 1)

  if (ch === 0x21/* ! */ || ch === 0x3F/* ? */) {
    end = scanSpecial(state, pos)
  } else if (ch === 0x2F/* / */ || isLetter(ch)) {
    const match = state.src.slice(pos).match(HTML_OPEN_CLOSE_TAG_RE)
    end = match ? pos + match[0].length : -1
  } else {
    return false
  }

  if (end < 0) { return false }

  if (!silent) {
    const token = state.push('html_inline', '', 0)
    token.content = state.src.slice(pos, end)

    if (isLinkOpen(token.content)) state.linkLevel++
    if (isLinkClose(token.content)) state.linkLevel--
  }
  state.pos = end
  return true
}
