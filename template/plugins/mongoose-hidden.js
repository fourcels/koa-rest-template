module.exports = function (schema) {
  const options = {
    transform (_, ret, options) {
      if (options.hide) {
        options.hide.split(' ').forEach(item => {
          delete ret[item]
        })
      }
      return ret
    }
  }
  schema.options.toJSON = Object.assign({}, schema.options.toJSON, options)
  schema.options.toObject = Object.assign({}, schema.options.toObject, options)
}
