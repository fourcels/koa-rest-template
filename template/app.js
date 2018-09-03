const Koa = require('koa')
const helmet = require('koa-helmet')
const cors = require('@koa/cors')
const bodyParser = require('koa-bodyparser')
const Application = require('./lib/Application')

const app = new Koa()
app.proxy = true // get real ip

// log
app.use(require('koa-log4js-logger')(app))

// error handling
app.use(require('./middlewares/error'))

// parameter
app.use(require('./middlewares/parameter')(app))

// middlewares
app.use(bodyParser())
app.use(helmet())
app.use(cors())

// error log
app.on('error', (err, ctx) => {
  ctx.log.error(err.stack)
})

// init app
const application = new Application(app)
application.init()

if (!module.parent) {
  const port = process.env.PORT || '3000'
  application.start(port)
  app.log.info('Listening on ' + port)
}

module.exports = app
