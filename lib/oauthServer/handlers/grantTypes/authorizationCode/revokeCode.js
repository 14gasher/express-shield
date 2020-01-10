const {
  InvalidGrantError,
} = require('../../../errors')

const revokeCode = async (code, { revokeAuthorizationCode }) => {
  const status = await revokeAuthorizationCode(code)
  if (!status) throw new InvalidGrantError('Authorization Code is Invalid')
  return code
}

module.exports = revokeCode
