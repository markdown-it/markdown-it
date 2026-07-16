// Core state object
//

import Token from '../token.mjs'

class StateCore {
  constructor (src, md, env) {
    this.src = src
    this.env = env
    this.tokens = []
    this.inlineMode = false
    this.md = md // link to parser instance

    // re-export Token class to use in core rules
    this.Token = Token
  }
}

export default StateCore
