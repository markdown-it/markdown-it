// Normalize input string

import type StateCore from './state_core.ts'

// https://spec.commonmark.org/0.29/#line-ending
const UNNORMALIZED_NEWLINE_RE = /\r\n?/g
const NULL_RE = /\0/g

export default function normalize (state: StateCore): void {
  let str = state.src

  // Normalize newlines
  if (str.indexOf('\r') >= 0) {
    str = str.replace(UNNORMALIZED_NEWLINE_RE, '\n')
  }

  // Replace NULL characters
  if (str.indexOf('\0') >= 0) {
    str = str.replace(NULL_RE, '\uFFFD')
  }

  state.src = str
}
