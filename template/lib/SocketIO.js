module.exports = class {
  constructor (app) {
    const server = require('http').createServer(app.callback())
    this.io = require('socket.io')(server)
    this.server = server
    this.app = app
    this.init()
  }
  init () {
    const { io, app } = this
    io.use((socket, next) => {
      const { token } = socket.handshake.query
      if (token) {
        try {
          socket.user = app.services.jwt.verify(token)
          return next()
        } catch (error) {
          return next(error)
        }
      }
      next(new Error('Authentication error'))
    })
    io.on('connection', function (socket) {
      console.log(socket.user, 'connection')
      socket.join(socket.user.id)
    })
  }
  emit (id, event, data) {
    const { io } = this
    io.to(id).emit(event, data)
  }
}
