// Early process links like https://example.org/ to have priority
// over emphasis, etc.

// RFC3986: scheme = ALPHA *( ALPHA / DIGIT / "+" / "-" / "." )
function isAsciiAlpha (code) {
  return (code >= 0x41 && code <= 0x5A) || (code >= 0x61 && code <= 0x7A)
}

function isSchemeChar (code) {
  return (code >= 0x41 && code <= 0x5A) ||
    (code >= 0x61 && code <= 0x7A) ||
    (code >= 0x30 && code <= 0x39) ||
    code === 0x2B || code === 0x2D || code === 0x2E
}

export default function linkify (state, silent) {
  if (!state.md.options.linkify) return false
  if (state.linkLevel > 0) return false

  const pos = state.pos
  const max = state.posMax

  if (pos + 3 > max) return false
  if (state.src.charCodeAt(pos) !== 0x3A/* : */) return false
  if (state.src.charCodeAt(pos + 1) !== 0x2F/* / */) return false
  if (state.src.charCodeAt(pos + 2) !== 0x2F/* / */) return false

  // Search backwards for the scheme, but no more than 10 characters, the length
  // of the pending string, or the length of the source prefix.
  // Use state.src instead of state.pending because it is faster to access.
  const protoMin = pos - Math.min(10, state.pending.length, pos)
  let protoStart = pos
  while (protoStart > protoMin && isSchemeChar(state.src.charCodeAt(protoStart - 1))) {
    protoStart--
  }

  if (protoStart === pos || !isAsciiAlpha(state.src.charCodeAt(protoStart))) return false

  const protoLength = pos - protoStart

  const link = state.md.linkify.matchAtStart(state.src.slice(protoStart))
  if (!link) return false

  let url = link.url

  // invalid link, but still detected by linkify somehow;
  // need to check to prevent infinite loop below
  if (url.length <= protoLength) return false

  // disallow '*' at the end of the link (conflicts with emphasis)
  // do manual backsearch to avoid perf issues with regex /\*+$/ on "****...****a".
  let urlEnd = url.length
  while (urlEnd > 0 && url.charCodeAt(urlEnd - 1) === 0x2A/* * */) {
    urlEnd--
  }
  if (urlEnd !== url.length) {
    url = url.slice(0, urlEnd)
  }

  const fullUrl = state.md.normalizeLink(url)
  if (!state.md.validateLink(fullUrl)) return false

  if (!silent) {
    state.pending = state.pending.slice(0, -protoLength)

    const token_o = state.push('link_open', 'a', 1)
    token_o.attrs = [['href', fullUrl]]
    token_o.markup = 'linkify'
    token_o.info = 'auto'

    const token_t = state.push('text', '', 0)
    token_t.content = state.md.normalizeLinkText(url)

    const token_c = state.push('link_close', 'a', -1)
    token_c.markup = 'linkify'
    token_c.info = 'auto'
  }

  state.pos += url.length - protoLength
  return true
}
