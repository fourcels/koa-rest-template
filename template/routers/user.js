const Router = require('koa-router')
const compose = require('koa-compose')
const jwt = compose([require('../middlewares/jwt'), async (ctx, next) => {
  const { User } = ctx.models
  const { token, user } = ctx.state
  if (!await User.verifyToken({ id: user.id, token })) {
    return ctx.throw(401, 'invalid token')
  }
  await next()
}])

const router = new Router({
  prefix: '/users'
})
module.exports = function ({ user }) {
  router.get('/', jwt, user.show.bind(user))
  router.post('/', user.create.bind(user))
  router.post('/login', user.login.bind(user))
  router.post('/notify', user.notify.bind(user))

  return router
}
