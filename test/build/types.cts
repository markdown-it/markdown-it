// Types are checked as a package consumer would see them, via `exports` map.
import md = require('markdown-it')

const parser = new md({ html: true })
const legacy = md('commonmark')
const tokens: md.Token[] = parser.parse('abc', {})
const Token: typeof md.Token = md.Token
const ruler: md.Ruler<[md.StateCore], void> = parser.core.ruler

export { parser, legacy, tokens, Token, ruler }
