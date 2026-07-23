// Token class

/**
 * class Token
 **/

/**
 * new Token(type, tag, nesting)
 *
 * Create new token and fill passed properties.
 **/
type TokenNesting = -1 | 0 | 1
type TokenAttribute = [name: string, value: string | number]

class Token {
  /**
   * Token#type -> String
   *
   * Type of the token (string, e.g. "paragraph_open")
   **/
  declare type: string

  /**
   * Token#tag -> String
   *
   * html tag name, e.g. "p"
   **/
  declare tag: string

  declare attrs: TokenAttribute[] | null

  /**
   * Token#map -> Array
   *
   * Source map info. Format: `[ line_begin, line_end ]`
   **/
  map: [number, number] | null = null

  /**
   * Token#nesting -> Number
   *
   * Level change (number in {-1, 0, 1} set), where:
   *
   * -  `1` means the tag is opening
   * -  `0` means the tag is self-closing
   * - `-1` means the tag is closing
   **/
  declare nesting: TokenNesting

  /**
   * Token#level -> Number
   *
   * nesting level, the same as `state.level`
   **/
  level = 0

  /**
   * Token#children -> Array
   *
   * An array of child nodes (inline and img tokens)
   **/
  children: Token[] | null = null

  /**
   * Token#content -> String
   *
   * In a case of self-closing tag (code, html, fence, etc.),
   * it has contents of this tag.
   **/
  content = ''

  /**
   * Token#markup -> String
   *
   * '*' or '_' for emphasis, fence string for fence, etc.
   **/
  markup = ''

  /**
   * Token#info -> String
   *
   * Additional information:
   *
   * - Info string for "fence" tokens
   * - The value "auto" for autolink "link_open" and "link_close" tokens
   * - The string value of the item marker for ordered-list "list_item_open" tokens
   **/
  info = ''

  declare meta: Record<string, unknown> | null

  /**
   * Token#block -> Boolean
   *
   * True for block-level tokens, false for inline tokens.
   * Used in renderer to calculate line breaks
   **/
  block = false

  /**
   * Token#hidden -> Boolean
   *
   * If it's true, ignore this element when rendering. Used for tight lists
   * to hide paragraphs.
   **/
  hidden = false

  constructor (type: string, tag: string, nesting: TokenNesting) {
    this.type = type
    this.tag = tag

    /**
   * Token#attrs -> Array
   *
   * Html attributes. Format: `[ [ name1, value1 ], [ name2, value2 ] ]`
   **/
    this.attrs = null

    this.nesting = nesting

    /**
   * Token#meta -> Object
   *
   * A place for plugins to store an arbitrary data
   **/
    this.meta = null
  }

  /**
 * Token.attrIndex(name) -> Number
 *
 * Search attribute index by name.
 **/
  attrIndex (name: string): number {
    if (!this.attrs) { return -1 }

    const attrs = this.attrs

    for (let i = 0, len = attrs.length; i < len; i++) {
      if (attrs[i][0] === name) { return i }
    }
    return -1
  }

  /**
 * Token.attrPush(attrData)
 *
 * Add `[ name, value ]` attribute to list. Init attrs if necessary
 **/
  attrPush (attrData: TokenAttribute): void {
    if (this.attrs) {
      this.attrs.push(attrData)
    } else {
      this.attrs = [attrData]
    }
  }

  /**
 * Token.attrSet(name, value)
 *
 * Set `name` attribute to `value`. Override old value if exists.
 **/
  attrSet (name: string, value: string | number): void {
    const idx = this.attrIndex(name)
    const attrData: TokenAttribute = [name, value]

    if (idx < 0) {
      this.attrPush(attrData)
    } else {
      this.attrs![idx] = attrData
    }
  }

  /**
 * Token.attrGet(name)
 *
 * Get the value of attribute `name`, or null if it does not exist.
 **/
  attrGet (name: string): string | number | null {
    const idx = this.attrIndex(name)
    let value = null
    if (idx >= 0) {
      value = this.attrs![idx][1]
    }
    return value
  }

  /**
 * Token.attrJoin(name, value)
 *
 * Join value to existing attribute via space. Or create new attribute if not
 * exists. Useful to operate with token classes.
 **/
  attrJoin (name: string, value: string | number): void {
    const idx = this.attrIndex(name)

    if (idx < 0) {
      this.attrPush([name, value])
    } else {
      this.attrs![idx][1] = `${this.attrs![idx][1]} ${value}`
    }
  }
}

export default Token
