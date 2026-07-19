import markdownit from '../../../src/index.ts'

const md = markdownit({
  html: true,
  linkify: true,
  typographer: true
})

export function run (data) {
  return md.render(data)
}
