const {
  MissingArgumentError,
  BadArgumentError,
} = require('../../../errors')

const shared = require('../shared')

const getCode = require('./getCode')
const validateUri = require('./validateUri')
const revokeCode = require('./revokeCode')
const saveAndValidateToken = require('./saveToken')

const authorizationCode = async (req, client, options) => {
  shared.verify(options)
  const {
    model,
    accessTokenLifetime,
    refreshTokenLifetime
  } = options
  const {
    getAuthorizationCode,
    revokeAuthorizationCode,
    saveToken,
  } = model
  if (!getAuthorizationCode) throw new MissingArgumentError('model.getAuthorizationCode')
  if (!revokeAuthorizationCode) throw new MissingArgumentError('model.revokeAuthorizationCode')
  if (!saveToken) throw new MissingArgumentError('model.saveToken')
  if (!req) throw new MissingArgumentError('request')
  if (!client) throw new MissingArgumentError('client')
  const code = await getCode(req, client, model)
  await validateUri(req, code)
  await revokeCode(code, model)
  return await saveAndValidateToken(code.user, client, code.authorizationCode, code.scope, model, accessTokenLifetime, refreshTokenLifetime)
}

module.exports = authorizationCode
