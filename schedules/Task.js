const Base = require('../lib/Base')

module.exports = class extends Base {
  get cron () {
    return '*/1 * * * *'
  }
  async run (date) {
    console.log(date.toString())
  }
}
