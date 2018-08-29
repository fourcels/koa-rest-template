const config = require('config')
module.exports = class Base {
  constructor (app) {
    this.app = app
    this.config = app.config
    this.models = app.models
    this.log = app.log
  }
}
