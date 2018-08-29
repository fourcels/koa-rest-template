const Base = require('../lib/Base')

module.exports = class extends Base {
  get cron () {
    return '*/1 * * * *'
  }
  async run (date) {
    this.log.info(date.toString())
  }
}
