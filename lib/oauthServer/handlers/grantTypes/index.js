const basicGrantTypes = {
  authorization_code: require('./authorizationCode'),
  client_credentials: require('./clientCredentials'),
  password: require('./password'),
  refresh_token: require('./refreshToken')
}

module.exports = basicGrantTypes
