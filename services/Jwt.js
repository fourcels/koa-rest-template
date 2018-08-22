const Base = require('../lib/Base')
const jwt = require('jsonwebtoken')
module.exports = class extends Base {
  verify (token) {
    const { secret } = this.config.get('jwt')
    return jwt.verify(token, secret)
  }
  sign (data) {
    const { secret, expiresIn } = this.config.get('jwt')
    const token = jwt.sign(data, secret, {
      expiresIn
    })
    return token
  }
}
