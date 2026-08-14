import type StateInline from '../rules_inline/state_inline.ts'

/** Finds the end of a link or image label (`[label]`). */
export default function parseLinkLabel (state: StateInline, start: number, disableNested?: boolean): number {
  let level, found, marker, prevPos

  const max = state.posMax
  const oldPos = state.pos

  // The backtick cache (`state.backticks` / `state.backticksScanned`) memoizes a
  // single left-to-right scan of the current line. `skipToken()` below runs the
  // inline rules in silent mode purely as a lookahead, so it must not leak into
  // that cache: a code span consumed during the lookahead hides its closing
  // backtick run from the cache, and reaching the end of the line flips the
  // `backticksScanned` latch. Either would make the real parse miss a valid code
  // span once the label turns out not to be a link. Give the lookahead its own
  // cache and restore the caller's afterwards, exactly as we do for `state.pos`.
  const oldBackticks = state.backticks
  const oldBackticksScanned = state.backticksScanned
  state.backticks = {}
  state.backticksScanned = false

  state.pos = start + 1
  level = 1

  while (state.pos < max) {
    marker = state.src.charCodeAt(state.pos)
    if (marker === 0x5D /* ] */) {
      level--
      if (level === 0) {
        found = true
        break
      }
    }

    prevPos = state.pos
    state.md.inline.skipToken(state)
    if (marker === 0x5B /* [ */) {
      if (prevPos === state.pos - 1) {
        // increase level if we find text `[`, which is not a part of any token
        level++
      } else if (disableNested) {
        state.pos = oldPos
        state.backticks = oldBackticks
        state.backticksScanned = oldBackticksScanned
        return -1
      }
    }
  }

  let labelEnd = -1

  if (found) {
    labelEnd = state.pos
  }

  // restore old state
  state.pos = oldPos
  state.backticks = oldBackticks
  state.backticksScanned = oldBackticksScanned

  return labelEnd
}
