/** internal
 * class ParserCore
 *
 * Top-level rules executor. Glues block/inline parsers and does intermediate
 * transformations.
 **/

import Ruler from './ruler.ts'
import StateCore from './rules_core/state_core.ts'

import r_normalize from './rules_core/normalize.ts'
import r_block from './rules_core/block.ts'
import r_inline from './rules_core/inline.ts'
import r_linkify from './rules_core/linkify.ts'
import r_replacements from './rules_core/replacements.ts'
import r_smartquotes from './rules_core/smartquotes.ts'
import r_text_join from './rules_core/text_join.ts'

const _rules = [
  ['normalize', r_normalize],
  ['block', r_block],
  ['inline', r_inline],
  ['linkify', r_linkify],
  ['replacements', r_replacements],
  ['smartquotes', r_smartquotes],
  // `text_join` finds `text_special` tokens (for escape sequences)
  // and joins them with the rest of the text
  ['text_join', r_text_join]
]

/**
 * new ParserCore()
 **/
class ParserCore {
  constructor () {
    /**
     * ParserCore#ruler -> Ruler
     *
     * [[Ruler]] instance. Keep configuration of core rules.
     **/
    this.ruler = new Ruler()

    for (let i = 0; i < _rules.length; i++) {
      this.ruler.push(_rules[i][0], _rules[i][1])
    }

    this.State = StateCore
  }

  /**
   * ParserCore.process(state)
   *
   * Executes core chain rules.
   **/
  process (state) {
    const rules = this.ruler.getRules('')

    for (let i = 0, l = rules.length; i < l; i++) {
      rules[i](state)
    }
  }
}

export default ParserCore
