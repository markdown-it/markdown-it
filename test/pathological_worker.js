'use strict'

exports.render = async (str, mdOpts) => {
  return (await import('../index.mjs')).default(mdOpts).render(str)
}
