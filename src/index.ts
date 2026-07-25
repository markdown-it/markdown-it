import { callable } from './common/utils.ts'
import MarkdownItClass from './markdownit.ts'

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
const MarkdownIt = callable(MarkdownItClass)

export default MarkdownIt
