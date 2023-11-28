'use strict'

exports.render = async (str) => {
  return (await import('../index.mjs')).default().render(str)
}
