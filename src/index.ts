import { callable } from './common/utils.ts'
import MarkdownIt from './markdownit.ts'

/**
 * Default package export.
 *
 * For backward compatibility, the {@link MarkdownIt} class is wrapped so
 * legacy code can call it without `new`. New code should instantiate it as a
 * regular class with `new`. The compatibility wrapper may be removed in a
 * future release.
 *
 * @category Main
 */
const MarkdownItCallable = callable(MarkdownIt)

export default MarkdownItCallable

export type { default as MarkdownIt, MarkdownItPreset } from './markdownit.ts'
export type { Delimiter, Env, MarkdownItOptions } from './types.ts'
export type { default as Token } from './token.ts'
export type { default as Ruler } from './ruler.ts'
export type { default as Renderer, RendererRule } from './renderer.ts'
export type { default as ParserCore } from './parser_core.ts'
export type { default as StateCore } from './rules_core/state_core.ts'
export type { default as ParserBlock } from './parser_block.ts'
export type { default as StateBlock } from './rules_block/state_block.ts'
export type { default as ParserInline } from './parser_inline.ts'
export type { default as StateInline } from './rules_inline/state_inline.ts'
