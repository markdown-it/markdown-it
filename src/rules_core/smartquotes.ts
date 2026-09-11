// Convert straight quotation marks to typographic ones
//

import { isWhiteSpace, isPunctCharCode, isMdAsciiPunct } from '../common/utils.ts'
import type Token from '../token.ts'
import type StateCore from './state_core.ts'

const QUOTE_TEST_RE = /['"]/
const QUOTE_RE = /['"]/g
const APOSTROPHE = '\u2019' /* ’ */

interface Replacement {
  pos: number
  ch: string
}

type ReplacementMap = Record<string, Replacement[]>

interface QuoteOpener {
  token: number
  pos: number
  single: boolean
  level: number
  prevSame: number
}

function addReplacement (
  replacements: ReplacementMap,
  tokenIdx: number,
  pos: number,
  ch: string
) {
  if (!replacements[tokenIdx]) {
    replacements[tokenIdx] = []
  }

  replacements[tokenIdx].push({ pos, ch })
}

function applyReplacements (str: string, replacements: Replacement[]) {
  let result = ''
  let lastPos = 0

  replacements.sort((a, b) => a.pos - b.pos)

  for (let i = 0; i < replacements.length; i++) {
    const replacement = replacements[i]

    result += str.slice(lastPos, replacement.pos) + replacement.ch
    lastPos = replacement.pos + 1
  }

  return result + str.slice(lastPos)
}

function process_inlines (tokens: Token[], state: StateCore) {
  let j

  const stack: QuoteOpener[] = []
  const heads = new Map<number, { single: number, double: number }>()
  // token index -> list of replacements in the original token content
  const replacements: ReplacementMap = {}

  function truncateStack (length: number) {
    // Each opener is removed at most once
    while (stack.length > length) {
      const item = stack.pop()!
      const head = heads.get(item.level)!
      head[item.single ? 'single' : 'double'] = item.prevSame
      if (head.single === -1 && head.double === -1) heads.delete(item.level)
    }
  }

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]

    const thisLevel = tokens[i].level

    for (j = stack.length - 1; j >= 0; j--) {
      if (stack[j].level <= thisLevel) { break }
    }
    truncateStack(j + 1)

    if (token.type !== 'text') { continue }

    const text = token.content
    let pos = 0
    const max = text.length

    /* eslint no-labels:0,block-scoped-var:0 */
    OUTER:
    while (pos < max) {
      QUOTE_RE.lastIndex = pos
      const t = QUOTE_RE.exec(text)
      if (!t) { break }

      let canOpen = true
      let canClose = true
      pos = t.index + 1
      const isSingle = (t[0] === "'")

      // Find previous character,
      // default to space if it's the beginning of the line
      //
      let lastChar = 0x20

      if (t.index - 1 >= 0) {
        lastChar = text.charCodeAt(t.index - 1)
      } else {
        for (j = i - 1; j >= 0; j--) {
          if (tokens[j].type === 'softbreak' || tokens[j].type === 'hardbreak') break // lastChar defaults to 0x20
          if (!tokens[j].content) continue // should skip all tokens except 'text', 'html_inline' or 'code_inline'

          lastChar = tokens[j].content.charCodeAt(tokens[j].content.length - 1)
          break
        }
      }

      // Find next character,
      // default to space if it's the end of the line
      //
      let nextChar = 0x20

      if (pos < max) {
        nextChar = text.charCodeAt(pos)
      } else {
        for (j = i + 1; j < tokens.length; j++) {
          if (tokens[j].type === 'softbreak' || tokens[j].type === 'hardbreak') break // nextChar defaults to 0x20
          if (!tokens[j].content) continue // should skip all tokens except 'text', 'html_inline' or 'code_inline'

          nextChar = tokens[j].content.charCodeAt(0)
          break
        }
      }

      const isLastPunctChar = isMdAsciiPunct(lastChar) || isPunctCharCode(lastChar)
      const isNextPunctChar = isMdAsciiPunct(nextChar) || isPunctCharCode(nextChar)

      const isLastWhiteSpace = isWhiteSpace(lastChar)
      const isNextWhiteSpace = isWhiteSpace(nextChar)

      if (isNextWhiteSpace) {
        canOpen = false
      } else if (isNextPunctChar) {
        if (!(isLastWhiteSpace || isLastPunctChar)) {
          canOpen = false
        }
      }

      if (isLastWhiteSpace) {
        canClose = false
      } else if (isLastPunctChar) {
        if (!(isNextWhiteSpace || isNextPunctChar)) {
          canClose = false
        }
      }

      if (nextChar === 0x22 /* " */ && t[0] === '"') {
        if (lastChar >= 0x30 /* 0 */ && lastChar <= 0x39 /* 9 */) {
          // special case: 1"" - count first quote as an inch
          canClose = canOpen = false
        }
      }

      if (canOpen && canClose) {
        // Replace quotes in the middle of punctuation sequence, but not
        // in the middle of the words, i.e.:
        //
        // 1. foo " bar " baz - not replaced
        // 2. foo-"-bar-"-baz - replaced
        // 3. foo"bar"baz     - not replaced
        //
        canOpen = isLastPunctChar
        canClose = isNextPunctChar
      }

      if (!canOpen && !canClose) {
        // middle of word
        if (isSingle) {
          addReplacement(replacements, i, t.index, APOSTROPHE)
        }
        continue
      }

      if (canClose) {
        // Index by level and type
        j = heads.get(thisLevel)?.[isSingle ? 'single' : 'double'] ?? -1
        if (j >= 0) {
          const item = stack[j]

          let openQuote
          let closeQuote
          if (isSingle) {
            openQuote = state.md.options.quotes[2]
            closeQuote = state.md.options.quotes[3]
          } else {
            openQuote = state.md.options.quotes[0]
            closeQuote = state.md.options.quotes[1]
          }

          addReplacement(replacements, i, t.index, closeQuote)
          addReplacement(replacements, item.token, item.pos, openQuote)

          truncateStack(j)
          continue OUTER
        }
      }

      if (canOpen) {
        let head = heads.get(thisLevel)
        if (!head) {
          head = { single: -1, double: -1 }
          heads.set(thisLevel, head)
        }
        const kind = isSingle ? 'single' : 'double'
        stack.push({
          token: i,
          pos: t.index,
          single: isSingle,
          level: thisLevel,
          prevSame: head[kind]
        })
        head[kind] = stack.length - 1
      } else if (canClose && isSingle) {
        addReplacement(replacements, i, t.index, APOSTROPHE)
      }
    }
  }

  Object.keys(replacements).forEach(function (tokenIdx) {
    const idx = Number(tokenIdx)
    tokens[idx].content = applyReplacements(tokens[idx].content, replacements[tokenIdx])
  })
}

export default function smartquotes (state: StateCore): void {
  /* eslint max-depth:0 */
  if (!state.md.options.typographer) { return }

  for (let blkIdx = state.tokens.length - 1; blkIdx >= 0; blkIdx--) {
    if (state.tokens[blkIdx].type !== 'inline' ||
        !QUOTE_TEST_RE.test(state.tokens[blkIdx].content)) {
      continue
    }

    process_inlines(state.tokens[blkIdx].children!, state)
  }
}
