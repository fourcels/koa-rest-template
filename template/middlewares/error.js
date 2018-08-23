module.exports = async (ctx, next) => {
  try {
    await next()
  } catch (error) {
    // will only respond with JSON
    ctx.status = error.statusCode || error.status || 500
    if (ctx.status === 500) {
      ctx.app.emit('error', error, ctx)
    }
    ctx.body = {
      status: ctx.status,
      message: error.message
    }
  }
}
