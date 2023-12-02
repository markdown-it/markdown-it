// Parse link title
//

import { unescapeAll } from '../common/utils.mjs'

export default function parseLinkTitle (str, start, max) {
  let code, marker
  let lines = 0
  let pos = start

  const result = {
    ok: false,
    pos: 0,
    lines: 0,
    str: ''
  }

  if (pos >= max) { return result }

  marker = str.charCodeAt(pos)

  if (marker !== 0x22 /* " */ && marker !== 0x27 /* ' */ && marker !== 0x28 /* ( */) { return result }

  pos++

  // if opening marker is "(", switch it to closing marker ")"
  if (marker === 0x28) { marker = 0x29 }

  while (pos < max) {
    code = str.charCodeAt(pos)
    if (code === marker) {
      result.pos = pos + 1
      result.lines = lines
      result.str = unescapeAll(str.slice(start + 1, pos))
      result.ok = true
      return result
    } else if (code === 0x28 /* ( */ && marker === 0x29 /* ) */) {
      return result
    } else if (code === 0x0A) {
      lines++
    } else if (code === 0x5C /* \ */ && pos + 1 < max) {
      pos++
      if (str.charCodeAt(pos) === 0x0A) {
        lines++
      }
    }

    pos++
  }

  return result
}
