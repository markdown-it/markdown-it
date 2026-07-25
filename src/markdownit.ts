// Main parser class

import * as utils from './common/utils.ts'
import * as helpers from './helpers/index.ts'
import Token from './token.ts'
import Ruler from './ruler.ts'
import Renderer from './renderer.ts'
import ParserCore from './parser_core.ts'
import StateCore from './rules_core/state_core.ts'
import ParserBlock from './parser_block.ts'
import StateBlock from './rules_block/state_block.ts'
import ParserInline from './parser_inline.ts'
import StateInline from './rules_inline/state_inline.ts'
import { LinkifyIt } from 'linkify-it'
import * as mdurl from 'mdurl'
import punycode from 'punycode.js'

import cfg_default from './presets/default.ts'
import cfg_zero from './presets/zero.ts'
import cfg_commonmark from './presets/commonmark.ts'
import type { Env, MarkdownItOptions } from './types.ts'

const config = {
  default: cfg_default,
  zero: cfg_zero,
  commonmark: cfg_commonmark
}

type MarkdownItPresetName = keyof typeof config

interface MarkdownItPreset {
  options?: MarkdownItOptions
  components?: {
    core?: {
      rules?: string[]
    }
    block?: {
      rules?: string[]
    }
    inline?: {
      rules?: string[]
      rules2?: string[]
    }
  }
}

type MarkdownItComponentName = keyof NonNullable<MarkdownItPreset['components']>

//
// This validator can prohibit more than really needed to prevent XSS. It's a
// tradeoff to keep code simple and to be secure by default.
//
// If you need different setup - override validator method as you wish. Or
// replace it with dummy function and use external sanitizer.
//

const BAD_PROTO_RE = /^(vbscript|javascript|file|data):/
const GOOD_DATA_RE = /^data:image\/(gif|png|jpeg|webp);/

function validateLink (url: string): boolean {
  // url should be normalized at this point, and existing entities are decoded
  const str = url.trim().toLowerCase()

  return BAD_PROTO_RE.test(str) ? GOOD_DATA_RE.test(str) : true
}

const RECODE_HOSTNAME_FOR = ['http:', 'https:', 'mailto:']

function normalizeLink (url: string): string {
  const parsed = mdurl.parse(url, true)

  if (parsed.hostname) {
    // Encode hostnames in urls like:
    // `http://host/`, `https://host/`, `mailto:user@host`, `//host/`
    //
    // We don't encode unknown schemas, because it's likely that we encode
    // something we shouldn't (e.g. `skype:name` treated as `skype:host`)
    //
    if (!parsed.protocol || RECODE_HOSTNAME_FOR.indexOf(parsed.protocol) >= 0) {
      try {
        parsed.hostname = punycode.toASCII(parsed.hostname)
      } catch (er) { /**/ }
    }
  }

  return mdurl.encode(mdurl.format(parsed))
}

function normalizeLinkText (url: string): string {
  const parsed = mdurl.parse(url, true)

  if (parsed.hostname) {
    // Encode hostnames in urls like:
    // `http://host/`, `https://host/`, `mailto:user@host`, `//host/`
    //
    // We don't encode unknown schemas, because it's likely that we encode
    // something we shouldn't (e.g. `skype:name` treated as `skype:host`)
    //
    if (!parsed.protocol || RECODE_HOSTNAME_FOR.indexOf(parsed.protocol) >= 0) {
      try {
        parsed.hostname = punycode.toUnicode(parsed.hostname)
      } catch (er) { /**/ }
    }
  }

  // add '%' to exclude list because of https://github.com/markdown-it/markdown-it/issues/720
  return mdurl.decode(mdurl.format(parsed), mdurl.decode.defaultChars + '%')
}

/**
 * Main parser/renderer class.
 *
 * Creates a parser instance with the given config. Can be called without `new`.
 *
 * The optional `presetName` can be `commonmark` or `zero`.
 *
 * MarkdownIt provides named presets as a convenience to quickly
 * enable/disable active syntax rules and options for common use cases.
 *
 * - ["commonmark"](https://github.com/markdown-it/markdown-it/blob/master/src/presets/commonmark.ts) -
 *   configures parser to strict [CommonMark](http://commonmark.org/) mode.
 * - [default](https://github.com/markdown-it/markdown-it/blob/master/src/presets/default.ts) -
 *   similar to GFM, used when no preset name given. Enables all available rules,
 *   but still without html, typographer & autolinker.
 * - ["zero"](https://github.com/markdown-it/markdown-it/blob/master/src/presets/zero.ts) -
 *   all rules disabled. Useful to quickly setup your config via `.enable()`.
 *   For example, when you need only `bold` and `italic` markup and nothing else.
 *
 * Available options:
 *
 * - __html__ - `false`. Set `true` to enable HTML tags in source. Be careful!
 *   That's not safe! You may need external sanitizer to protect output from XSS.
 *   It's better to extend features via plugins, instead of enabling HTML.
 * - __xhtmlOut__ - `false`. Set `true` to add '/' when closing single tags
 *   (`<br />`). This is needed only for full CommonMark compatibility. In real
 *   world you will need HTML output.
 * - __breaks__ - `false`. Set `true` to convert `\n` in paragraphs into `<br>`.
 * - __langPrefix__ - `language-`. CSS language class prefix for fenced blocks.
 *   Can be useful for external highlighters.
 * - __linkify__ - `false`. Set `true` to autoconvert URL-like text to links.
 * - __typographer__  - `false`. Set `true` to enable [some language-neutral
 *   replacement](https://github.com/markdown-it/markdown-it/blob/master/src/rules_core/replacements.ts) +
 *   quotes beautification (smartquotes).
 * - __quotes__ - `“”‘’`. Double + single quotes replacement pairs, when
 *   typographer enabled and smartquotes on. For example, you can use
 *   `'«»„“'` for Russian, `'„“‚‘'` for German, and
 *   `['«\xA0', '\xA0»', '‹\xA0', '\xA0›']` for French (including nbsp).
 * - __highlight__ - `null`. Highlighter function for fenced code blocks.
 *   Highlighter `function (str, lang)` should return escaped HTML. It can also
 *   return empty string if the source was not changed and should be escaped
 *   externaly. If result starts with <pre... internal wrapper is skipped.
 *
 * @example Basic usage
 * ```javascript
 * // node.js, "classic" way:
 * var MarkdownIt = require('markdown-it'),
 *     md = new MarkdownIt();
 * var result = md.render('# markdown-it rulezz!');
 *
 * // node.js, the same, but with sugar:
 * var md = require('markdown-it')();
 * var result = md.render('# markdown-it rulezz!');
 *
 * // browser without AMD, added to "window" on script load
 * // Note, there are no dash.
 * var md = window.markdownit();
 * var result = md.render('# markdown-it rulezz!');
 * ```
 *
 * @example Single line rendering, without paragraph wrap
 * ```javascript
 * var md = require('markdown-it')();
 * var result = md.renderInline('__markdown-it__ rulezz!');
 * ```
 *
 * @example Presets and options
 * ```javascript
 * // commonmark mode
 * var md = require('markdown-it')('commonmark');
 *
 * // default mode
 * var md = require('markdown-it')();
 *
 * // enable everything
 * var md = require('markdown-it')({
 *   html: true,
 *   linkify: true,
 *   typographer: true
 * });
 * ```
 *
 * @example Syntax highlighting
 * ```js
 * var hljs = require('highlight.js') // https://highlightjs.org/
 *
 * var md = require('markdown-it')({
 *   highlight: function (str, lang) {
 *     if (lang && hljs.getLanguage(lang)) {
 *       try {
 *         return hljs.highlight(str, { language: lang, ignoreIllegals: true }).value;
 *       } catch (__) {}
 *     }
 *
 *     return ''; // use external default escaping
 *   }
 * });
 * ```
 *
 * @example Full wrapper override
 * If you need assign class to `<pre>` or `<code>`:
 * ```javascript
 * var hljs = require('highlight.js') // https://highlightjs.org/
 *
 * // Actual default values
 * var md = require('markdown-it')({
 *   highlight: function (str, lang) {
 *     if (lang && hljs.getLanguage(lang)) {
 *       try {
 *         return `<pre><code class="hljs">${hljs.highlight(str, { language: lang, ignoreIllegals: true }).value}</code></pre>`;
 *       } catch (__) {}
 *     }
 *
 *     return `<pre><code class="hljs">${md.utils.escapeHtml(str)}</code></pre>`;
 *   }
 * });
 * ```
 *
 * @category Main
 */
class MarkdownIt {
  /**
   * Instance of {@link ParserInline}. You may need it to add new rules when
   * writing plugins. For simple rules control use {@link MarkdownIt.disable}
   * and {@link MarkdownIt.enable}.
   */
  inline = new ParserInline()

  /**
   * Instance of {@link ParserBlock}. You may need it to add new rules when
   * writing plugins. For simple rules control use {@link MarkdownIt.disable}
   * and {@link MarkdownIt.enable}.
   */
  block = new ParserBlock()

  /**
   * Instance of {@link ParserCore} chain executor. You may need it to add new
   * rules when writing plugins. For simple rules control use
   * {@link MarkdownIt.disable} and {@link MarkdownIt.enable}.
   */
  core = new ParserCore()

  /**
   * Instance of {@link Renderer}. Use it to modify output look. Or to add rendering
   * rules for new token types, generated by plugins.
   *
   * See {@link Renderer} docs and
   * [source code](https://github.com/markdown-it/markdown-it/blob/master/src/renderer.ts).
   *
   * @example
   * ```javascript
   * var md = require('markdown-it')();
   *
   * function myToken(tokens, idx, options, env, self) {
   *   //...
   *   return result;
   * };
   *
   * md.renderer.rules['my_token'] = myToken
   * ```
   */
  renderer = new Renderer()

  /**
   * [linkify-it](https://github.com/markdown-it/linkify-it) instance.
   * Used by [linkify](https://github.com/markdown-it/markdown-it/blob/master/src/rules_core/linkify.ts)
   * rule.
   */
  linkify = new LinkifyIt()

  /**
   * Link validation function. CommonMark allows too much in links. By default
   * we disable `javascript:`, `vbscript:`, `file:` schemas, and almost all `data:...` schemas
   * except some embedded image types.
   *
   * You can change this behaviour:
   *
   * @example
   * ```javascript
   * var md = require('markdown-it')();
   * // enable everything
   * md.validateLink = function () { return true; }
   * ```
   */
  validateLink = validateLink

  /**
   * Function used to encode link url to a machine-readable format,
   * which includes url-encoding, punycode, etc.
   */
  normalizeLink = normalizeLink

  /**
   * Function used to decode link url to a human-readable format`
   */
  normalizeLinkText = normalizeLinkText

  // Expose utils & helpers for easy acces from plugins

  /**
   * Assorted utility functions, useful to write plugins. See details
   * [here](https://github.com/markdown-it/markdown-it/blob/master/src/common/utils.ts).
   */
  utils = utils

  /**
   * Link components parser functions, useful to write plugins. See details
   * [here](https://github.com/markdown-it/markdown-it/blob/master/src/helpers).
   */
  helpers = Object.assign({}, helpers)

  declare options: MarkdownItOptions

  constructor (
    ...args:
      | []
      | [options: Partial<MarkdownItOptions>]
      | [presetName: MarkdownItPresetName, options?: Partial<MarkdownItOptions>]
  ) {
    const [presetNameOrOptions, options] = args

    if (typeof presetNameOrOptions === 'string') {
      this.configure(presetNameOrOptions)
      if (options) { this.set(options) }
    } else {
      this.configure('default')
      this.set(presetNameOrOptions || {})
    }
  }

  /**
   * Set parser options (in the same format as in constructor). Probably, you
   * will never need it, but you can change options after constructor call.
   *
   * __Note:__ To achieve the best possible performance, don't modify a
   * `markdown-it` instance options on the fly. If you need multiple configurations
   * it's best to create multiple instances and initialize each with separate
   * config.
   *
   * @example
   * ```javascript
   * var md = require('markdown-it')()
   *             .set({ html: true, breaks: true })
   *             .set({ typographer: true });
   * ```
   */
  set (options: Partial<MarkdownItOptions>): this {
    Object.assign(this.options, options)
    return this
  }

  /**
   * Batch load of all options and compenent settings. This is internal method,
   * and you probably will not need it. But if you will - see available presets
   * and data structure [here](https://github.com/markdown-it/markdown-it/tree/master/src/presets)
   *
   * We strongly recommend to use presets instead of direct config loads. That
   * will give better compatibility with next versions.
   */
  configure (presets: MarkdownItPresetName | MarkdownItPreset): this {
    let p: MarkdownItPreset

    if (typeof presets === 'string') {
      const presetName = presets
      p = config[presetName]
      if (!p) { throw new Error(`Wrong 'markdown-it' preset "${presetName}", check name`) }
    } else {
      p = presets
    }

    if (!p) { throw new Error('Wrong `markdown-it` preset, can\'t be empty') }

    if (p.options) { this.options = { ...p.options } }

    const components = p.components
    if (components) {
      const componentNames: MarkdownItComponentName[] = ['core', 'block', 'inline']
      componentNames.forEach((name) => {
        const rules = components[name]?.rules
        if (rules) {
          this[name].ruler.enableOnly(rules)
        }
      })

      const rules2 = components.inline?.rules2
      if (rules2) {
        this.inline.ruler2.enableOnly(rules2)
      }
    }
    return this
  }

  /**
   * Enable list or rules. It will automatically find appropriate components,
   * containing rules with given names. If rule not found, and `ignoreInvalid`
   * not set - throws exception.
   *
   * @param list Rule name or list of rule names to enable.
   * @param ignoreInvalid Set `true` to ignore errors when rule not found.
   *
   * @example
   * ```javascript
   * var md = require('markdown-it')()
   *             .enable(['sub', 'sup'])
   *             .disable('smartquotes');
   * ```
   */
  enable (list: string | string[], ignoreInvalid = false): this {
    let result: string[] = []

    if (!Array.isArray(list)) { list = [list] }

    const chains: MarkdownItComponentName[] = ['core', 'block', 'inline']
    chains.forEach((chain) => {
      result = result.concat(this[chain].ruler.enable(list, true))
    })

    result = result.concat(this.inline.ruler2.enable(list, true))

    const missed = list.filter((name) => result.indexOf(name) < 0)

    if (missed.length && !ignoreInvalid) {
      throw new Error(`MarkdownIt. Failed to enable unknown rule(s): ${missed}`)
    }

    return this
  }

  /**
   * The same as {@link MarkdownIt.enable}, but turn specified rules off.
   *
   * @param list Rule name or list of rule names to disable.
   * @param ignoreInvalid Set `true` to ignore errors when rule not found.
   */
  disable (list: string | string[], ignoreInvalid = false): this {
    let result: string[] = []

    if (!Array.isArray(list)) { list = [list] }

    const chains: MarkdownItComponentName[] = ['core', 'block', 'inline']
    chains.forEach((chain) => {
      result = result.concat(this[chain].ruler.disable(list, true))
    })

    result = result.concat(this.inline.ruler2.disable(list, true))

    const missed = list.filter((name) => result.indexOf(name) < 0)

    if (missed.length && !ignoreInvalid) {
      throw new Error(`MarkdownIt. Failed to disable unknown rule(s): ${missed}`)
    }
    return this
  }

  /**
   * Load specified plugin with given params into current parser instance.
   * It's just a sugar to call `plugin(md, params)` with curring.
   *
   * @example
   * ```javascript
   * var iterator = require('markdown-it-for-inline');
   * var md = require('markdown-it')()
   *             .use(iterator, 'foo_replace', 'text', function (tokens, idx) {
   *               tokens[idx].content = tokens[idx].content.replace(/foo/g, 'bar');
   *             });
   * ```
   */
  use<Params extends unknown[]> (
    plugin: (md: this, ...params: Params) => void,
    ...params: Params
  ): this {
    plugin.apply(plugin, [this, ...params])
    return this
  }

  /**
   * Parse input string and return list of block tokens (special token type
   * "inline" will contain list of inline tokens). You should not call this
   * method directly, until you write custom renderer (for example, to produce
   * AST).
   *
   * `env` is used to pass data between "distributed" rules and return additional
   * metadata like reference info, needed for the renderer. It also can be used to
   * inject data in specific cases. Usually, you will be ok to pass `{}`,
   * and then pass updated object to renderer.
   *
   * @param src Source string.
   * @param env Environment sandbox.
   */
  parse (src: string, env: Env): Token[] {
    if (typeof src !== 'string') {
      throw new Error('Input data should be a String')
    }

    const state = new this.core.State(src, this, env)

    this.core.process(state)

    return state.tokens
  }

  /**
   * Render markdown string into html. It does all magic for you :).
   *
   * `env` can be used to inject additional metadata (`{}` by default).
   * But you will not need it with high probability. See also comment
   * in {@link MarkdownIt.parse}.
   *
   * @param src Source string.
   * @param env Environment sandbox.
   */
  render (src: string, env: Env = {}): string {
    return this.renderer.render(this.parse(src, env), this.options, env)
  }

  /**
   * The same as {@link MarkdownIt.parse} but skip all block rules. It returns
   * the block tokens list with the single `inline` element, containing parsed
   * inline tokens in `children` property. Also updates `env` object.
   *
   * @param src Source string.
   * @param env Environment sandbox.
   */
  parseInline (src: string, env: Env): Token[] {
    const state = new this.core.State(src, this, env)

    state.inlineMode = true
    this.core.process(state)

    return state.tokens
  }

  /**
   * Similar to {@link MarkdownIt.render} but for single paragraph content.
   * Result will NOT be wrapped into `<p>` tags.
   *
   * @param src Source string.
   * @param env Environment sandbox.
   */
  renderInline (src: string, env: Env = {}): string {
    return this.renderer.render(this.parseInline(src, env), this.options, env)
  }

  static Token = Token
  static Ruler = Ruler
  static Renderer = Renderer
  static ParserCore = ParserCore
  static StateCore = StateCore
  static ParserBlock = ParserBlock
  static StateBlock = StateBlock
  static ParserInline = ParserInline
  static StateInline = StateInline
}

export default MarkdownIt
