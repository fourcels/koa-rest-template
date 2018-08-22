const schedule = require('node-schedule')
const fs = require('fs-extra')
const path = require('path')
const config = require('config')
const mongoose = require('mongoose')
const Router = require('koa-router')
module.exports = class {
  constructor (app) {
    this.app = app
    this.config = config
  }
  load (name, instance = false, rootDir = path.resolve(__dirname, '..')) {
    const { app } = this
    const dirPath = path.resolve(rootDir, name)
    const obj = {}
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath)
      files.forEach(item => {
        if (path.extname(item) === '.js') {
          const name = path.basename(item, '.js')
          if (instance) {
            const Klass = require(path.resolve(dirPath, item))
            obj[name.toLowerCase()] = new Klass(app)
          } else {
            obj[name] = require(path.resolve(dirPath, item))
          }
        }
      })
    }
    return obj
  }
  initController () {
    const { app } = this
    app.controllers = app.context.controllers = this.load('controllers', true)
  }
  initService () {
    const { app } = this
    app.services = app.context.services = this.load('services', true)
  }
  initModel () {
    const { app } = this
    app.models = this.load('models', false)
    app.context.models = app.models
  }
  initSchedule () {
    const schedules = this.load('schedules', true)
    for (const key in schedules) {
      if (schedules.hasOwnProperty(key)) {
        const item = schedules[key]
        if (item.cron && typeof item.run === 'function') {
          schedule.scheduleJob(item.cron, item.run.bind(item))
        }
      }
    }
  }
  initRouter () {
    const { app } = this
    const routers = this.load('routers', false)
    const { prefix } = this.config
    const rootRouter = new Router({
      prefix
    })
    for (const key in routers) {
      if (routers.hasOwnProperty(key)) {
        const fn = routers[key]
        if (typeof fn === 'function') {
          const router = fn(app.controllers)
          rootRouter
            .use(router.routes())
            .use(router.allowedMethods())
        }
      }
    }
    app.use(rootRouter.routes())
  }
  initMongoose () {
    const { uri } = this.config.get('mongoose')
    mongoose.connect(uri, { useNewUrlParser: true })
  }
  initConfig () {
    const { app } = this
    app.config = config
    app.context.config = config
  }
  init () {
    this.initConfig()
    this.initModel()
    this.initController()
    this.initService()
    this.initSchedule()
    this.initRouter()
    this.initMongoose()
  }
}
