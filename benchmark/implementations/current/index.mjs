import markdownit from '../../../index.mjs'

const md = markdownit({
  html: true,
  linkify: true,
  typographer: true
})

export function run (data) {
  return md.render(data)
}
