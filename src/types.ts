/** @inline */
export interface Reference {
  title: string
  href: string
}

/**
 * Shared environment passed through parsing and rendering.
 *
 * Plugins may use it to store arbitrary data.
 */
export interface Env {
  [key: string | symbol]: unknown
  references?: Record<string, Reference>
}

/** Delimiter entry used by emphasis-like inline rules. */
export interface Delimiter {
  /** Char code of the starting marker. */
  marker: number

  /** Total length of this series of delimiters. */
  length?: number

  /** A position of the token this delimiter corresponds to. */
  token: number

  /**
   * If this delimiter is matched as a valid opener, `end` will be
   * equal to its position, otherwise it's `-1`.
   */
  end: number

  /** Whether this delimiter can open an emphasis. */
  open: boolean

  /** Whether this delimiter can close an emphasis. */
  close: boolean

  /** One delimiter represents two characters. */
  jump?: number
}

/**
 * Options controlling Markdown parsing and rendering.
 *
 * @category Main
 */
export interface MarkdownItOptions {
  /** Enable HTML tags in source. */
  html?: boolean

  /** Use '/' to close single tags (`<br />`). */
  xhtmlOut?: boolean

  /** Convert '\n' in paragraphs into `<br>`. */
  breaks?: boolean

  /** CSS language prefix for fenced blocks. */
  langPrefix?: string

  /** Autoconvert URL-like text to links. */
  linkify?: boolean

  /** Enable language-neutral replacements and quotes beautification. */
  typographer?: boolean

  /**
   * Double + single quotes replacement pairs, when typographer is enabled
   * and smartquotes are on. Can be either a string or an array.
   *
   * For example, use `'«»„“'` for Russian, `'„“‚‘'` for German, and
   * `['«\xA0', '\xA0»', '‹\xA0', '\xA0›']` for French (including nbsp).
   */
  quotes?: string | string[]

  /**
   * Highlighter function. Should return escaped HTML, or an empty string if
   * the source string was not changed and should be escaped externally.
   * If the result starts with `<pre`, the internal wrapper is skipped.
   */
  highlight?: ((str: string, lang: string, attrs: string) => string) | null

  /** Internal protection against excessive recursion. */
  maxNesting?: number
}
