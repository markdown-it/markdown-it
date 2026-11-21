// Parse backticks

import type StateInline from './state_inline.ts'

// Position of the last backtick run of each length. Derived from the string in
// one pass, so unlike an incremental cache it never depends on how the parser
// walks it, and stays valid across lookaheads and narrowed ranges.
function buildLastRuns (src: string): Record<number, number> {
  const lastRuns: Record<number, number> = {}
  let pos = 0

  while ((pos = src.indexOf('`', pos)) !== -1) {
    const start = pos
    while (src.charCodeAt(++pos) === 0x60/* ` */) { /* scan run length */ }
    lastRuns[pos - start] = start
  }

  return lastRuns
}

export default function backtick (state: StateInline, silent: boolean): boolean {
  const start = state.pos

  if (state.src.charCodeAt(start) !== 0x60/* ` */) { return false }

  const max = state.posMax
  let pos = start + 1

  // scan marker length
  while (pos < max && state.src.charCodeAt(pos) === 0x60/* ` */) { pos++ }

  const marker = state.src.slice(start, pos)
  const openerLength = marker.length

  if (!state.backticksScanned) {
    state.backticks = buildLastRuns(state.src)
    state.backticksScanned = true
  }

  // Nothing of the same length left in the string, so no closer can exist
  if ((state.backticks[openerLength] ?? -1) >= pos) {
    let matchEnd = pos
    let matchStart

    while ((matchStart = state.src.indexOf('`', matchEnd)) !== -1 && matchStart < max) {
      // Measure the whole run, not just its part inside the current range,
      // otherwise a run straddling `max` would be mistaken for a shorter one
      matchEnd = matchStart + 1
      while (state.src.charCodeAt(matchEnd) === 0x60/* ` */) { matchEnd++ }

      if (matchEnd > max) break

      if (matchEnd - matchStart === openerLength) {
        if (!silent) {
          const token = state.push('code_inline', 'code', 0)
          token.markup = marker
          let content = state.src.slice(pos, matchStart).replace(/\n[ \t]*/g, ' ')

          // Strip one space from each side, unless the content is all spaces
          if (content.startsWith(' ') && content.endsWith(' ') && /[^ ]/.test(content)) {
            content = content.slice(1, -1)
          }

          token.content = content
        }
        state.pos = matchEnd
        return true
      }
    }
  }

  if (!silent) state.pending += marker
  state.pos = pos
  return true
}
