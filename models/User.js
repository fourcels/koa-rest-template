const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const { Schema } = mongoose
const schema = Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  password: {
    type: String,
    required: true
  },
  token: {
    type: String,
    required: true
  },
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    hide: 'password',
  }
})

schema.pre('save', function () {
  if (this.isModified('password')) {
    this.password = bcrypt.hashSync(this.password)
  }
})

schema.statics.checkNameExist = async function (name) {
  const count = await this.countDocuments({
    name
  })
  return !!count
}
schema.statics.verifyUser = async function ({ name, password }) {
  const userDoc = await this.findOne({
    name
  })
  if (!userDoc) {
    return false
  }
  return userDoc.comparePassword(password)
}
schema.statics.verifyToken = async function ({ id, token }) {
  const count = await this.countDocuments({
    _id: id,
    token
  })
  return count > 0
}
schema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password)
}

schema.plugin(require('../plugins/mongoose-hidden'))

module.exports = mongoose.model('User', schema)
