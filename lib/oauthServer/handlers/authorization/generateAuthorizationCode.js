const tokenUtil = require('../../utils/token')

const generateAuthorizationCode = async (client, user, scope, generateAuthorizationCode) => {
  if (generateAuthorizationCode) {
    return generateAuthorizationCode(client, user, scope)
  }
  return tokenUtil.generateRandomToken()
}

module.exports = generateAuthorizationCode
