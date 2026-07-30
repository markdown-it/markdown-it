import MarkdownIt, { type Token } from 'markdown-it'

const parser = new MarkdownIt({ html: true })
const tokens: Token[] = parser.parse('abc', {})

export { parser, tokens }
