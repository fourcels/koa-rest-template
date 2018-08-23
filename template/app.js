const Koa = require('koa')
const logger = require('koa-logger')
const helmet = require('koa-helmet')
const cors = require('@koa/cors')
const bodyParser = require('koa-bodyparser')
const Application = require('./lib/Application')

const app = new Koa()

// error handling
app.use(require('./middlewares/error'))
app.use(require('./middlewares/parameter')(app))

// middlewares
app.use(bodyParser())
app.use(helmet())
app.use(cors())
app.use(logger())

// init app
const application = new Application(app)
application.init()

// error log
app.on('error', (err, ctx) => {
  console.error(err.stack)
})

if (!module.parent) {
  const port = process.env.PORT || '3000'
  app.listen(port)
  console.log('Listening on ' + port)
}

module.exports = app
