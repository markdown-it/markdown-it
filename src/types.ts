export type Env = Record<string, unknown>

export interface MarkdownItOptions {
  /** Enable HTML tags in source. */
  html: boolean

  /** Use '/' to close single tags (`<br />`). */
  xhtmlOut: boolean

  /** Convert '\n' in paragraphs into `<br>`. */
  breaks: boolean

  /** CSS language prefix for fenced blocks. */
  langPrefix: string

  /** Autoconvert URL-like text to links. */
  linkify: boolean

  /** Enable language-neutral replacements and quotes beautification. */
  typographer: boolean

  /**
   * Double + single quotes replacement pairs, when typographer is enabled
   * and smartquotes are on. Can be either a string or an array.
   *
   * For example, use `'«»„“'` for Russian, `'„“‚‘'` for German, and
   * `['«\xA0', '\xA0»', '‹\xA0', '\xA0›']` for French (including nbsp).
   */
  quotes: string | string[]

  /**
   * Highlighter function. Should return escaped HTML, or an empty string if
   * the source string was not changed and should be escaped externally.
   * If the result starts with `<pre`, the internal wrapper is skipped.
   */
  highlight: ((str: string, lang: string, attrs: string) => string) | null

  /** Internal protection against excessive recursion. */
  maxNesting: number
}
