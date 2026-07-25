import Ruler from './ruler.ts'
import StateBlock from './rules_block/state_block.ts'
import type Token from './token.ts'
import type MarkdownIt from './markdownit.ts'
import type { Env } from './types.ts'

import r_table from './rules_block/table.ts'
import r_code from './rules_block/code.ts'
import r_fence from './rules_block/fence.ts'
import r_blockquote from './rules_block/blockquote.ts'
import r_hr from './rules_block/hr.ts'
import r_list from './rules_block/list.ts'
import r_reference from './rules_block/reference.ts'
import r_html_block from './rules_block/html_block.ts'
import r_heading from './rules_block/heading.ts'
import r_lheading from './rules_block/lheading.ts'
import r_paragraph from './rules_block/paragraph.ts'

const _rules: Array<[
  name: string,
  rule: (state: StateBlock, startLine: number, endLine: number, silent: boolean) => boolean,
  alt?: string[]
]> = [
  // First 2 params - rule name & source. Secondary array - list of rules,
  // which can be terminated by this one.
  ['table', r_table, ['paragraph', 'reference']],
  ['code', r_code],
  ['fence', r_fence, ['paragraph', 'reference', 'blockquote', 'list']],
  ['blockquote', r_blockquote, ['paragraph', 'reference', 'blockquote', 'list']],
  ['hr', r_hr, ['paragraph', 'reference', 'blockquote', 'list']],
  ['list', r_list, ['paragraph', 'reference', 'blockquote']],
  ['reference', r_reference],
  ['html_block', r_html_block, ['paragraph', 'reference', 'blockquote']],
  ['heading', r_heading, ['paragraph', 'reference', 'blockquote']],
  ['lheading', r_lheading],
  ['paragraph', r_paragraph]
]

/**
 * Block-level tokenizer.
 */
class ParserBlock {
  /**
   * {@link Ruler} instance. Keep configuration of block rules.
   */
  ruler = new Ruler<[StateBlock, number, number, boolean], boolean>()

  State = StateBlock

  constructor () {
    for (let i = 0; i < _rules.length; i++) {
      this.ruler.push(_rules[i][0], _rules[i][1], { alt: (_rules[i][2] || []).slice() })
    }
  }

  // Generate tokens for input range
  //
  tokenize (state: StateBlock, startLine: number, endLine: number): void {
    const rules = this.ruler.getRules('')
    const len = rules.length
    const maxNesting = state.md.options.maxNesting
    let line = startLine
    let hasEmptyLines = false

    while (line < endLine) {
      state.line = line = state.skipEmptyLines(line)
      if (line >= endLine) { break }

      // Termination condition for nested calls.
      // Nested calls currently used for blockquotes & lists
      if (state.sCount[line] < state.blkIndent) { break }

      // If nesting level exceeded - skip tail to the end. That's not ordinary
      // situation and we should not care about content.
      if (state.level >= maxNesting) {
        state.line = endLine
        break
      }

      // Try all possible rules.
      // On success, rule should:
      //
      // - update `state.line`
      // - update `state.tokens`
      // - return true
      const prevLine = state.line
      let ok = false

      for (let i = 0; i < len; i++) {
        ok = rules[i](state, line, endLine, false)
        if (ok) {
          if (prevLine >= state.line) {
            throw new Error("block rule didn't increment state.line")
          }
          break
        }
      }

      // this can only happen if user disables paragraph rule
      if (!ok) throw new Error('none of the block rules matched')

      // set state.tight if we had an empty line before current tag
      // i.e. latest empty line should not count
      state.tight = !hasEmptyLines

      // paragraph might "eat" one newline after it in nested lists
      if (state.isEmpty(state.line - 1)) {
        hasEmptyLines = true
      }

      line = state.line

      if (line < endLine && state.isEmpty(line)) {
        hasEmptyLines = true
        line++
        state.line = line
      }
    }
  }

  /**
   * Process input string and push block tokens into `outTokens`
   */
  parse (src: string, md: MarkdownIt, env: Env, outTokens: Token[]): void {
    if (!src) { return }

    const state = new this.State(src, md, env, outTokens)

    this.tokenize(state, state.line, state.lineMax)
  }
}

export default ParserBlock
