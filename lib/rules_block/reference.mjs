import { isSpace, normalizeReference } from '../common/utils.mjs'

// CommonMark limits reference labels to 999 Unicode code points.
const MAX_LABEL_LENGTH = 999

function countCodePoints (str) {
  let length = str.length

  for (let i = 0; i < str.length - 1; i++) {
    const high = str.charCodeAt(i)
    if (high < 0xD800 || high > 0xDBFF) { continue }

    const low = str.charCodeAt(i + 1)
    if (low >= 0xDC00 && low <= 0xDFFF) {
      length--
      i++
    }
  }

  return length
}

// Exclusive end offset of the line, after its newline if present
function lineEnd (state, line) {
  return Math.min(state.eMarks[line] + 1, state.src.length)
}

// Returns -1 if the reference can't continue on this line
function getNextLinePos (state, nextLine) {
  const endLine = state.lineMax

  if (nextLine >= endLine || state.isEmpty(nextLine)) {
    // empty line or end of input
    return -1
  }

  let isContinuation = false

  // this would be a code block normally, but after paragraph
  // it's considered a lazy continuation regardless of what's there
  if (state.sCount[nextLine] - state.blkIndent > 3) { isContinuation = true }

  // quirk for blockquotes, this line should already be checked by that rule
  if (state.sCount[nextLine] < 0) { isContinuation = true }

  if (!isContinuation) {
    const terminatorRules = state.md.block.ruler.getRules('reference')
    const oldParentType = state.parentType
    state.parentType = 'reference'

    // Some tags can terminate paragraph without empty line.
    let terminate = false
    for (let i = 0, l = terminatorRules.length; i < l; i++) {
      if (terminatorRules[i](state, nextLine, endLine, true)) {
        terminate = true
        break
      }
    }

    state.parentType = oldParentType
    if (terminate) {
      // terminated by another block
      return -1
    }
  }

  return state.bMarks[nextLine] + state.tShift[nextLine]
}

export default function reference (state, startLine, _endLine, silent) {
  const src = state.src
  let pos = state.bMarks[startLine] + state.tShift[startLine]
  let nextLine = startLine + 1

  // if it's indented more than 3 spaces, it should be a code block
  if (state.sCount[startLine] - state.blkIndent >= 4) { return false }

  if (src.charCodeAt(pos) !== 0x5B/* [ */) { return false }

  // Scan the source directly: indexing a string after each appended line
  // can make V8 copy the accumulated prefix on every continuation.
  let max = lineEnd(state, startLine)

  let rawLabel = ''
  let labelEnd = -1
  let segmentStart = ++pos

  while (pos < max) {
    if (rawLabel.length + pos - segmentStart > MAX_LABEL_LENGTH * 2) { return false }

    let ch = src.charCodeAt(pos)
    if (ch === 0x5B /* [ */) { return false }
    if (ch === 0x5D /* ] */) {
      labelEnd = pos
      break
    }
    if (ch === 0x5C /* \ */) { ch = src.charCodeAt(++pos) }

    if (ch === 0x0A /* \n */ && pos < max) {
      const nextPos = getNextLinePos(state, nextLine)
      if (nextPos < 0) { return false }
      rawLabel += src.slice(segmentStart, max)
      pos = segmentStart = nextPos
      max = lineEnd(state, nextLine++)
      continue
    }
    pos++
  }

  if (labelEnd < 0 || src.charCodeAt(labelEnd + 1) !== 0x3A/* : */) { return false }

  rawLabel += src.slice(segmentStart, labelEnd)

  if (rawLabel.length > MAX_LABEL_LENGTH && countCodePoints(rawLabel) > MAX_LABEL_LENGTH) {
    return false
  }

  // [label]:   destination   'title'
  //         ^^^ skip optional whitespace here
  pos = labelEnd + 2
  while (pos < max) {
    const ch = src.charCodeAt(pos)
    if (ch === 0x0A) {
      const nextPos = getNextLinePos(state, nextLine)
      if (nextPos < 0) { break }
      pos = nextPos
      max = lineEnd(state, nextLine++)
    } else if (isSpace(ch)) {
      pos++
    } else {
      break
    }
  }

  // [label]:   destination   'title'
  //            ^^^^^^^^^^^ parse this
  const destRes = state.md.helpers.parseLinkDestination(src, pos, max)
  if (!destRes.ok) { return false }

  const href = state.md.normalizeLink(destRes.str)
  if (!state.md.validateLink(href)) { return false }

  pos = destRes.pos

  // save cursor state, we could require to rollback later
  const destEndPos = pos
  const destEndMax = max
  const destEndLineNo = nextLine

  // [label]:   destination   'title'
  //                       ^^^ skipping those spaces
  while (pos < max) {
    const ch = src.charCodeAt(pos)
    if (ch === 0x0A) {
      const nextPos = getNextLinePos(state, nextLine)
      if (nextPos < 0) { break }
      pos = nextPos
      max = lineEnd(state, nextLine++)
    } else if (isSpace(ch)) {
      pos++
    } else {
      break
    }
  }

  // [label]:   destination   'title'
  //                          ^^^^^^^ parse this
  const titleStart = pos
  let titleRes = state.md.helpers.parseLinkTitle(src, pos, max)
  while (titleRes.can_continue) {
    const nextPos = getNextLinePos(state, nextLine)
    if (nextPos < 0) break
    pos = nextPos
    max = lineEnd(state, nextLine++)
    titleRes = state.md.helpers.parseLinkTitle(src, pos, max, titleRes)
  }
  let title

  if (titleStart !== destEndPos && titleRes.ok) {
    title = titleRes.str
    pos = titleRes.pos
  } else {
    title = ''
    pos = destEndPos
    max = destEndMax
    nextLine = destEndLineNo
  }

  // skip trailing spaces until the rest of the line
  while (pos < max) {
    const ch = src.charCodeAt(pos)
    if (!isSpace(ch)) { break }
    pos++
  }

  if (pos < max && src.charCodeAt(pos) !== 0x0A) {
    if (title) {
      // garbage at the end of the line after title,
      // but it could still be a valid reference if we roll back
      title = ''
      pos = destEndPos
      max = destEndMax
      nextLine = destEndLineNo
      while (pos < max) {
        const ch = src.charCodeAt(pos)
        if (!isSpace(ch)) { break }
        pos++
      }
    }
  }

  if (pos < max && src.charCodeAt(pos) !== 0x0A) {
    // garbage at the end of the line
    return false
  }

  const label = normalizeReference(rawLabel)
  if (!label) {
    // CommonMark 0.20 disallows empty labels
    return false
  }

  // Reference can not terminate anything. This check is for safety only.
  /* istanbul ignore if */
  if (silent) { return true }

  if (typeof state.env.references === 'undefined') {
    state.env.references = {}
  }
  if (typeof state.env.references[label] === 'undefined') {
    state.env.references[label] = { title, href }
  }

  state.line = nextLine
  return true
}
