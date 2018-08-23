module.exports = {
  mongoose: {
    uri: 'mongodb://localhost/{{project.name}}'
  },
  jwt: {
    secret: '{{jwt.secret}}'
  }
}
