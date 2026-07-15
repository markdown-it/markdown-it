// Inline parser state

import Token from '../token.mjs'
import { isWhiteSpace, isPunctCharCode, isMdAsciiPunct } from '../common/utils.mjs'

function StateInline (src, md, env, outTokens) {
  this.src = src
  this.env = env
  this.md = md
  this.tokens = outTokens
  this.tokens_meta = Array(outTokens.length)

  this.pos = 0
  this.posMax = this.src.length
  this.level = 0
  this.pending = ''
  this.pendingLevel = 0

  // Stores { start: end } pairs. Useful for backtrack
  // optimization of pairs parse (emphasis, strikes).
  this.cache = {}

  // List of emphasis-like delimiters for current tag
  this.delimiters = []

  // Stack of delimiter lists for upper level tags
  this._prev_delimiters = []

  // backtick length => last seen position
  this.backticks = {}
  this.backticksScanned = false

  // Counter used to disable inline linkify-it execution
  // inside <a> and markdown links
  this.linkLevel = 0
}

// Flush pending text
//
StateInline.prototype.pushPending = function () {
  const token = new Token('text', '', 0)
  token.content = this.pending
  token.level = this.pendingLevel
  this.tokens.push(token)
  this.pending = ''
  return token
}

// Push new token to "stream".
// If pending text exists - flush it as text token
//
StateInline.prototype.push = function (type, tag, nesting) {
  if (this.pending) {
    this.pushPending()
  }

  const token = new Token(type, tag, nesting)
  let token_meta = null

  if (nesting < 0) {
    // closing tag
    this.level--
    this.delimiters = this._prev_delimiters.pop()
  }

  token.level = this.level

  if (nesting > 0) {
    // opening tag
    this.level++
    this._prev_delimiters.push(this.delimiters)
    this.delimiters = []
    token_meta = { delimiters: this.delimiters }
  }

  this.pendingLevel = this.level
  this.tokens.push(token)
  this.tokens_meta.push(token_meta)
  return token
}

// Scan a sequence of emphasis-like markers, and determine whether
// it can start an emphasis sequence or end an emphasis sequence.
//
//  - start - position to scan from (it should point at a valid marker);
//  - canSplitWord - determine if these markers can be found inside a word
//
StateInline.prototype.scanDelims = function (start, canSplitWord) {
  const max = this.posMax
  const marker = this.src.charCodeAt(start)

  // Astral characters below are combined manually, because .codePointAt()
  // does not guarantee numeric type output. And we don't wish JIT cache issues.
  // The broken surrogate pairs are evaluated as U+FFFD to prevent possible
  // crashes.

  let lastChar
  if (start === 0) {
    // treat beginning of the line as a whitespace
    lastChar = 0x20
  } else if (start === 1) {
    lastChar = this.src.charCodeAt(0)
    if ((lastChar & 0xF800) === 0xD800) { lastChar = 0xFFFD }
  } else {
    lastChar = this.src.charCodeAt(start - 1)
    if ((lastChar & 0xFC00) === 0xDC00) {
      // low surrogate => add high one, replace broken pair with U+FFFD
      const highSurr = this.src.charCodeAt(start - 2)
      lastChar = (highSurr & 0xFC00) === 0xD800
        ? 0x10000 + ((highSurr - 0xD800) << 10) + (lastChar - 0xDC00)
        : 0xFFFD
    } else if ((lastChar & 0xFC00) === 0xD800) {
      lastChar = 0xFFFD
    }
  }

  let pos = start
  while (pos < max && this.src.charCodeAt(pos) === marker) { pos++ }

  const count = pos - start

  // treat end of the line as a whitespace
  let nextChar = pos < max ? this.src.charCodeAt(pos) : 0x20
  if ((nextChar & 0xFC00) === 0xD800) {
    // high surrogate => add low one, replace broken pair with U+FFFD
    const lowSurr = this.src.charCodeAt(pos + 1)
    nextChar = (lowSurr & 0xFC00) === 0xDC00
      ? 0x10000 + ((nextChar - 0xD800) << 10) + (lowSurr - 0xDC00)
      : 0xFFFD
  } else if ((nextChar & 0xFC00) === 0xDC00) {
    nextChar = 0xFFFD
  }

  const isLastPunctChar = isMdAsciiPunct(lastChar) || isPunctCharCode(lastChar)
  const isNextPunctChar = isMdAsciiPunct(nextChar) || isPunctCharCode(nextChar)

  const isLastWhiteSpace = isWhiteSpace(lastChar)
  const isNextWhiteSpace = isWhiteSpace(nextChar)

  const left_flanking =
    !isNextWhiteSpace && (!isNextPunctChar || isLastWhiteSpace || isLastPunctChar)
  const right_flanking =
    !isLastWhiteSpace && (!isLastPunctChar || isNextWhiteSpace || isNextPunctChar)

  const can_open = left_flanking && (canSplitWord || !right_flanking || isLastPunctChar)
  const can_close = right_flanking && (canSplitWord || !left_flanking || isNextPunctChar)

  return { can_open, can_close, length: count }
}

// re-export Token class to use in block rules
StateInline.prototype.Token = Token

export default StateInline
