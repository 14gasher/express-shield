const {
  MissingArgumentError,
  BadArgumentError,
  InvaildScopeError,
} = require('../../../errors')

const tokenUtil = require('../../../utils/token')

const verify = ({
  accessTokenLifetime,
  model,
}) => {
  if (!model) throw new MissingArgumentError('model')
  if (!accessTokenLifetime) throw new MissingArgumentError('accessTokenLifetime')
  return true
}

const generateToken = key => async ({
  client,
  user,
  scope,
  model: {
    [key]: generator = tokenUtil.generateRandomToken,
  },
}) => {
  const token = await generator(client, user, scope)
  if (!token) throw new BadArgumentError(key, `falsy generated code. If a custom ${key} function is provided, return a non-falsy value`)
  return token
}

const getExpiresAt = lifetime => {
  const expires = new Date()
  expires.setSeconds(expires.getSeconds() + lifetime)
  return expires
}

const getScope = req => {
  const scope = req.body.scope
  if (!verifier.isUnicodeWithExclamationSpace) throw new InvaildScopeError('Scope is malformed')
  return scope
}

const validateScope = async ({
  user,
  client,
  scope,
  model: {
    validateScope,
  }
}) => {
  if(!validateScope) return scope
  const s = await validateScope(user, client, scope)
  if(!s) throw new InvaildScopeError('Requested Scope is invalid')
  return scope
}

module.exports = {
  verify,
  generateAccessToken: generateToken('generateAccessToken'),
  generateRefreshToken: generateToken('generateRefreshToken'),
  getAccessTokenExpiresAt: getExpiresAt,
  getRefreshTokenExpiresAt: getExpiresAt,
  getScope,
  validateScope,
}
