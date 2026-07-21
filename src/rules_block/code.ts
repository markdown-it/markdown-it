// Code block (4 spaces padded)

import type StateBlock from './state_block.ts'

export default function code (state: StateBlock, startLine: number, endLine: number/*, silent */): boolean {
  if (state.sCount[startLine] - state.blkIndent < 4) { return false }

  let nextLine = startLine + 1
  let last = nextLine

  while (nextLine < endLine) {
    if (state.isEmpty(nextLine)) {
      nextLine++
      continue
    }

    if (state.sCount[nextLine] - state.blkIndent >= 4) {
      nextLine++
      last = nextLine
      continue
    }
    break
  }

  state.line = last

  const token = state.push('code_block', 'code', 0)
  token.content = state.getLines(startLine, last, 4 + state.blkIndent, false) + '\n'
  token.map = [startLine, state.line]

  return true
}
