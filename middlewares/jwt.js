function resolveAuthHeader (ctx) {
  if (!ctx.header || !ctx.header.authorization) {
    return
  }

  const parts = ctx.header.authorization.split(' ')

  if (parts.length === 2) {
    const scheme = parts[0]
    const credentials = parts[1]

    if (/^Bearer$/i.test(scheme)) {
      return credentials
    }
  }
  ctx.throw(401, 'Bad Authorization header format. Format is "Authorization: Bearer <token>"')
}

module.exports = async (ctx, next) => {
  const token = resolveAuthHeader(ctx)
  try {
    ctx.state.token = token
    ctx.state.user = ctx.services.jwt.verify(token)
  } catch (error) {
    return ctx.throw(401, error.message)
  }
  await next()
}
