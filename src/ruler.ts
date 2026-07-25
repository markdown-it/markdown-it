type RuleOptions = { alt?: string[] }

/**
 * Helper class, used by {@link MarkdownIt.core}, {@link MarkdownIt.block} and
 * {@link MarkdownIt.inline} to manage sequences of functions (rules):
 *
 * - keep rules in defined order
 * - assign the name to each rule
 * - enable/disable rules
 * - add/replace rules
 * - allow assign rules to additional named chains (in the same)
 * - cacheing lists of active rules
 *
 * You will not need use this class directly until write plugins. For simple
 * rules control use {@link MarkdownIt.disable}, {@link MarkdownIt.enable} and
 * {@link MarkdownIt.use}.
 */
class Ruler<Args extends unknown[], Result> {
  // List of added rules. Each element is:
  //
  // {
  //   name: XXX,
  //   enabled: Boolean,
  //   fn: Function(),
  //   alt: [ name2, name3 ]
  // }
  //
  __rules__: Array<{
    name: string
    enabled: boolean
    fn: (...args: Args) => Result
    alt: string[]
  }> = []

  // Cached rule chains.
  //
  // First level - chain name, '' for default.
  // Second level - diginal anchor for fast filtering by charcodes.
  //
  __cache__: Record<string, Array<(...args: Args) => Result>> | null = null

  // Helper methods, should not be used directly

  // Find rule index by name
  //
  __find__ (name: string): number {
    for (let i = 0; i < this.__rules__.length; i++) {
      if (this.__rules__[i].name === name) {
        return i
      }
    }
    return -1
  }

  // Build rules lookup cache
  //
  __compile__ (): void {
    const chains = new Set<string>()

    // collect unique names
    this.__rules__.forEach(rule => {
      if (!rule.enabled) return
      rule.alt.forEach(altName => {
        if (altName) chains.add(altName)
      })
    })

    this.__cache__ = Object.create(null)

    // Collect default chain
    this.__cache__![''] = []
    this.__rules__.forEach(rule => {
      if (rule.enabled) this.__cache__![''].push(rule.fn)
    })

    // Collect alt chains
    chains.forEach(chain => {
      this.__cache__![chain] = []

      this.__rules__.forEach(rule => {
        if (rule.enabled && rule.alt.indexOf(chain) >= 0) {
          this.__cache__![chain].push(rule.fn)
        }
      })
    })
  }

  /**
   * Replace rule by name with new function & options. Throws error if name not
   * found.
   *
   * @param name Rule name to replace.
   * @param fn New rule function.
   * @param options Rule options. `alt` is an array with names of "alternate"
   * chains.
   *
   * @example Replace existing typographer replacement rule with new one
   * ```javascript
   * var md = require('markdown-it')();
   *
   * md.core.ruler.at('replacements', function replace(state) {
   *   //...
   * });
   * ```
   */
  at (name: string, fn: (...args: Args) => Result, options: RuleOptions = {}): void {
    const index = this.__find__(name)

    if (index === -1) { throw new Error(`Parser rule not found: ${name}`) }

    this.__rules__[index].fn = fn
    this.__rules__[index].alt = options.alt || []
    this.__cache__ = null
  }

  /**
   * Add new rule to chain before one with given name. See also
   * {@link Ruler.after}, {@link Ruler.push}.
   *
   * @param beforeName New rule will be added before this one.
   * @param ruleName Name of added rule.
   * @param fn Rule function.
   * @param options Rule options. `alt` is an array with names of "alternate"
   * chains.
   *
   * @example
   * ```javascript
   * var md = require('markdown-it')();
   *
   * md.block.ruler.before('paragraph', 'my_rule', function replace(state) {
   *   //...
   * });
   * ```
   */
  before (beforeName: string, ruleName: string, fn: (...args: Args) => Result, options: RuleOptions = {}): void {
    const index = this.__find__(beforeName)

    if (index === -1) { throw new Error(`Parser rule not found: ${beforeName}`) }

    this.__rules__.splice(index, 0, {
      name: ruleName,
      enabled: true,
      fn,
      alt: options.alt || []
    })

    this.__cache__ = null
  }

  /**
   * Add new rule to chain after one with given name. See also
   * {@link Ruler.before}, {@link Ruler.push}.
   *
   * @param afterName New rule will be added after this one.
   * @param ruleName Name of added rule.
   * @param fn Rule function.
   * @param options Rule options. `alt` is an array with names of "alternate"
   * chains.
   *
   * @example
   * ```javascript
   * var md = require('markdown-it')();
   *
   * md.inline.ruler.after('text', 'my_rule', function replace(state) {
   *   //...
   * });
   * ```
   */
  after (afterName: string, ruleName: string, fn: (...args: Args) => Result, options: RuleOptions = {}): void {
    const index = this.__find__(afterName)

    if (index === -1) { throw new Error(`Parser rule not found: ${afterName}`) }

    this.__rules__.splice(index + 1, 0, {
      name: ruleName,
      enabled: true,
      fn,
      alt: options.alt || []
    })

    this.__cache__ = null
  }

  /**
   * Push new rule to the end of chain. See also
   * {@link Ruler.before}, {@link Ruler.after}.
   *
   * @param ruleName Name of added rule.
   * @param fn Rule function.
   * @param options Rule options. `alt` is an array with names of "alternate"
   * chains.
   *
   * @example
   * ```javascript
   * var md = require('markdown-it')();
   *
   * md.core.ruler.push('my_rule', function replace(state) {
   *   //...
   * });
   * ```
   */
  push (ruleName: string, fn: (...args: Args) => Result, options: RuleOptions = {}): void {
    this.__rules__.push({
      name: ruleName,
      enabled: true,
      fn,
      alt: options.alt || []
    })

    this.__cache__ = null
  }

  /**
   * Enable rules with given names. If any rule name not found - throw Error.
   * Errors can be disabled by second param.
   *
   * See also {@link Ruler.disable}, {@link Ruler.enableOnly}.
   *
   * @param list List of rule names to enable.
   * @param ignoreInvalid Set `true` to ignore errors when rule not found.
   * @returns List of found rule names (if no exception happened).
   */
  enable (list: string | string[], ignoreInvalid = false): string[] {
    if (!Array.isArray(list)) { list = [list] }

    const result: string[] = []

    // Search by name and enable
    list.forEach(name => {
      const idx = this.__find__(name)

      if (idx < 0) {
        if (ignoreInvalid) { return }
        throw new Error(`Rules manager: invalid rule name ${name}`)
      }
      this.__rules__[idx].enabled = true
      result.push(name)
    })

    this.__cache__ = null
    return result
  }

  /**
   * Enable rules with given names, and disable everything else. If any rule name
   * not found - throw Error. Errors can be disabled by second param.
   *
   * See also {@link Ruler.disable}, {@link Ruler.enable}.
   *
   * @param list List of rule names to enable (whitelist).
   * @param ignoreInvalid Set `true` to ignore errors when rule not found.
   */
  enableOnly (list: string | string[], ignoreInvalid = false): void {
    if (!Array.isArray(list)) { list = [list] }

    this.__rules__.forEach(rule => { rule.enabled = false })

    this.enable(list, ignoreInvalid)
  }

  /**
   * Disable rules with given names. If any rule name not found - throw Error.
   * Errors can be disabled by second param.
   *
   * See also {@link Ruler.enable}, {@link Ruler.enableOnly}.
   *
   * @param list List of rule names to disable.
   * @param ignoreInvalid Set `true` to ignore errors when rule not found.
   * @returns List of found rule names (if no exception happened).
   */
  disable (list: string | string[], ignoreInvalid = false): string[] {
    if (!Array.isArray(list)) { list = [list] }

    const result: string[] = []

    // Search by name and disable
    list.forEach(name => {
      const idx = this.__find__(name)

      if (idx < 0) {
        if (ignoreInvalid) { return }
        throw new Error(`Rules manager: invalid rule name ${name}`)
      }
      this.__rules__[idx].enabled = false
      result.push(name)
    })

    this.__cache__ = null
    return result
  }

  /**
   * Return array of active functions (rules) for given chain name. It analyzes
   * rules configuration, compiles caches if not exists and returns result.
   *
   * Default chain name is `''` (empty string). It can't be skipped. That's
   * done intentionally, to keep signature monomorphic for high speed.
   */
  getRules (chainName: string): Array<(...args: Args) => Result> {
    if (!this.__cache__) this.__compile__()

    // Chain can be empty, if rules disabled. But we still have to return Array.
    return this.__cache__![chainName] || []
  }
}

export default Ruler
