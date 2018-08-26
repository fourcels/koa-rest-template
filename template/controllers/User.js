const Base = require('../lib/Base')

module.exports = class extends Base {
  async show (ctx) {
    const { user } = ctx.state
    const { User } = ctx.models
    const userDoc = await User.findById(user.id)
    ctx.body = userDoc
  }
  async login (ctx) {
    ctx.verifyParams({
      name: 'string',
      password: 'password'
    })
    const { name, password } = ctx.request.body
    const { User } = ctx.models
    if (!await User.verifyUser({ name, password })) {
      return ctx.throw(400, 'user not exist or password invalid')
    }
    const userDoc = await User.findOne({ name })

    // resign if token invalid
    if (!await ctx.services.jwt.verify(userDoc.token)) {
      userDoc.token = await ctx.services.jwt.sign({ id: userDoc.id })
      await userDoc.save()
    }
    ctx.body = userDoc
  }
  async create (ctx) {
    ctx.verifyParams({
      name: 'string',
      password: 'password'
    })
    const { name, password } = ctx.request.body
    const { User } = ctx.models
    if (await User.checkNameExist(name)) {
      return ctx.throw(400, `user ${name} exist`)
    }
    const userDoc = new User({
      name,
      password
    })
    userDoc.token = ctx.services.jwt.sign({
      id: userDoc.id
    })
    await userDoc.save()
    ctx.body = userDoc
  }
  async notify (ctx) {
    ctx.verifyParams({
      type: 'string',
      name: 'string',
      message: 'string'
    })
    const { type, name, message } = ctx.request.body
    const { User } = ctx.models
    const userDoc = await User.findOne({
      name
    })
    if (!userDoc) {
      return ctx.throw(400, 'user not found')
    }
    ctx.io.emit(userDoc.id, type, message)
    ctx.status = 204
  }
}
