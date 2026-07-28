import Ruler from './ruler.ts'
import StateCore from './rules_core/state_core.ts'

import r_normalize from './rules_core/normalize.ts'
import r_block from './rules_core/block.ts'
import r_strip_references from './rules_core/strip_references.ts'
import r_inline from './rules_core/inline.ts'
import r_linkify from './rules_core/linkify.ts'
import r_replacements from './rules_core/replacements.ts'
import r_smartquotes from './rules_core/smartquotes.ts'
import r_text_join from './rules_core/text_join.ts'

const _rules: Array<[
  name: string,
  rule: (state: StateCore) => void
]> = [
  ['normalize', r_normalize],
  ['block', r_block],
  ['strip_references', r_strip_references],
  ['inline', r_inline],
  ['linkify', r_linkify],
  ['replacements', r_replacements],
  ['smartquotes', r_smartquotes],
  // `text_join` finds `text_special` tokens (for escape sequences)
  // and joins them with the rest of the text
  ['text_join', r_text_join]
]

/**
 * Top-level rules executor. Glues block/inline parsers and does intermediate
 * transformations.
 */
class ParserCore {
  /**
   * {@link Ruler} instance. Keep configuration of core rules.
   */
  ruler = new Ruler<[StateCore], void>()

  State = StateCore

  constructor () {
    for (let i = 0; i < _rules.length; i++) {
      this.ruler.push(_rules[i][0], _rules[i][1])
    }
  }

  /**
   * Executes core chain rules.
   */
  process (state: StateCore): void {
    const rules = this.ruler.getRules('')

    for (let i = 0, l = rules.length; i < l; i++) {
      rules[i](state)
    }
  }
}

export default ParserCore
