import { isSpace, normalizeReference } from '../common/utils.mjs'

export default function reference (state, startLine, _endLine, silent) {
  let lines = 0

  let pos = state.bMarks[startLine] + state.tShift[startLine]
  let max = state.eMarks[startLine]
  let nextLine = startLine + 1

  // if it's indented more than 3 spaces, it should be a code block
  if (state.sCount[startLine] - state.blkIndent >= 4) { return false }

  if (state.src.charCodeAt(pos) !== 0x5B/* [ */) { return false }

  // Simple check to quickly interrupt scan on [link](url) at the start of line.
  // Can be useful on practice: https://github.com/markdown-it/markdown-it/issues/54
  while (++pos < max) {
    if (state.src.charCodeAt(pos) === 0x5D /* ] */ &&
        state.src.charCodeAt(pos - 1) !== 0x5C/* \ */) {
      if (pos + 1 === max) { return false }
      if (state.src.charCodeAt(pos + 1) !== 0x3A/* : */) { return false }
      break
    }
  }

  const endLine = state.lineMax

  // jump line-by-line until empty one or EOF
  const terminatorRules = state.md.block.ruler.getRules('reference')

  const oldParentType = state.parentType
  state.parentType = 'reference'

  for (; nextLine < endLine && !state.isEmpty(nextLine); nextLine++) {
    // this would be a code block normally, but after paragraph
    // it's considered a lazy continuation regardless of what's there
    if (state.sCount[nextLine] - state.blkIndent > 3) { continue }

    // quirk for blockquotes, this line should already be checked by that rule
    if (state.sCount[nextLine] < 0) { continue }

    // Some tags can terminate paragraph without empty line.
    let terminate = false
    for (let i = 0, l = terminatorRules.length; i < l; i++) {
      if (terminatorRules[i](state, nextLine, endLine, true)) {
        terminate = true
        break
      }
    }
    if (terminate) { break }
  }

  const str = state.getLines(startLine, nextLine, state.blkIndent, false).trim()
  max = str.length
  let labelEnd = -1

  for (pos = 1; pos < max; pos++) {
    const ch = str.charCodeAt(pos)
    if (ch === 0x5B /* [ */) {
      return false
    } else if (ch === 0x5D /* ] */) {
      labelEnd = pos
      break
    } else if (ch === 0x0A /* \n */) {
      lines++
    } else if (ch === 0x5C /* \ */) {
      pos++
      if (pos < max && str.charCodeAt(pos) === 0x0A) {
        lines++
      }
    }
  }

  if (labelEnd < 0 || str.charCodeAt(labelEnd + 1) !== 0x3A/* : */) { return false }

  // [label]:   destination   'title'
  //         ^^^ skip optional whitespace here
  for (pos = labelEnd + 2; pos < max; pos++) {
    const ch = str.charCodeAt(pos)
    if (ch === 0x0A) {
      lines++
    } else if (isSpace(ch)) {
      /* eslint no-empty:0 */
    } else {
      break
    }
  }

  // [label]:   destination   'title'
  //            ^^^^^^^^^^^ parse this
  const destRes = state.md.helpers.parseLinkDestination(str, pos, max)
  if (!destRes.ok) { return false }

  const href = state.md.normalizeLink(destRes.str)
  if (!state.md.validateLink(href)) { return false }

  pos = destRes.pos
  lines += destRes.lines

  // save cursor state, we could require to rollback later
  const destEndPos = pos
  const destEndLineNo = lines

  // [label]:   destination   'title'
  //                       ^^^ skipping those spaces
  const start = pos
  for (; pos < max; pos++) {
    const ch = str.charCodeAt(pos)
    if (ch === 0x0A) {
      lines++
    } else if (isSpace(ch)) {
      /* eslint no-empty:0 */
    } else {
      break
    }
  }

  // [label]:   destination   'title'
  //                          ^^^^^^^ parse this
  const titleRes = state.md.helpers.parseLinkTitle(str, pos, max)
  let title

  if (pos < max && start !== pos && titleRes.ok) {
    title = titleRes.str
    pos = titleRes.pos
    lines += titleRes.lines
  } else {
    title = ''
    pos = destEndPos
    lines = destEndLineNo
  }

  // skip trailing spaces until the rest of the line
  while (pos < max) {
    const ch = str.charCodeAt(pos)
    if (!isSpace(ch)) { break }
    pos++
  }

  if (pos < max && str.charCodeAt(pos) !== 0x0A) {
    if (title) {
      // garbage at the end of the line after title,
      // but it could still be a valid reference if we roll back
      title = ''
      pos = destEndPos
      lines = destEndLineNo
      while (pos < max) {
        const ch = str.charCodeAt(pos)
        if (!isSpace(ch)) { break }
        pos++
      }
    }
  }

  if (pos < max && str.charCodeAt(pos) !== 0x0A) {
    // garbage at the end of the line
    return false
  }

  const label = normalizeReference(str.slice(1, labelEnd))
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

  state.parentType = oldParentType

  state.line = startLine + lines + 1
  return true
}
