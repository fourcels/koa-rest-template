const config = require('config')
module.exports = class Base {
  constructor (app) {
    this.app = app
    this.config = config
    this.models = app.models
  }
}
