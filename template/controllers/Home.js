const Base = require('../lib/Base')

module.exports = class extends Base {
  async hello (ctx) {
    ctx.body = 'Hello {{titleize project.name}}'
  }
}
