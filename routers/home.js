const Router = require('koa-router')

const router = new Router()
module.exports = function ({ home }) {
  router.get('/', home.hello.bind(home))
  return router
}
