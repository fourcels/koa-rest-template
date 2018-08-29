const Parameter = require('parameter')
const mongoose = require('mongoose')

// custom rules
const rules = {
  phone: /1\d{10}/,
  objectId: function (_, val) {
    if (!mongoose.Types.ObjectId.isValid(val)) {
      return this.t('should be a objectId')
    }
  }
}

module.exports = function (app, translate) {
  let parameter

  if (typeof translate === 'function') {
    parameter = new Parameter({
      translate
    })
  } else {
    parameter = new Parameter()
  }

  for (const key in rules) {
    if (rules.hasOwnProperty(key)) {
      parameter.addRule(key, rules[key])
    }
  }

  app.context.verifyParams = function (rules, params) {
    if (!rules) {
      return
    }

    if (!params) {
      params = ['GET', 'HEAD'].includes(this.method.toUpperCase())
        ? this.request.query
        : this.request.body

      // copy
      params = Object.assign({}, params, this.params)
    }
    const errors = parameter.validate(rules, params)
    if (!errors) {
      return
    }
    this.throw(422, 'Validation Failed', {
      code: 'INVALID_PARAM',
      errors: errors,
      params: params
    })
  }

  return async function verifyParam (ctx, next) {
    try {
      await next()
    } catch (err) {
      if (err.code === 'INVALID_PARAM') {
        ctx.status = 422
        ctx.body = {
          message: err.message,
          errors: err.errors,
          params: err.params
        }
        return
      }
      throw err
    }
  }
}
