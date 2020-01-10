
const verifier = require('../../../verifier')
const {
  MissingArgumentError,
  BadArgumentError,
  InvalidRequestError,
  InvalidGrantError,
} = require('../../../errors')

const shared = require('../shared')

const getNewToken = async (req, providedClient, getRefreshToken) => {
  const refreshToken = req.body.refresh_token
  if(!refreshToken) throw new InvalidRequestError('Missing Parameter: `refresh_token`. Please include this in the body of your request.')
  if(!verifier.isPrintableUnicode(refreshToken)) throw new InvalidRequestError('Invalid Parameter: `refresh_token`. Please ensure it consists of printable unicode characters')
  const token = await getRefreshToken(refreshToken)
  if(!token) throw new InvalidGrantError('Refresh Token is invalid')
  const {
    client,
    user,
    refreshTokenExpiresAt,
  } = token
  if (!client) throw new MissingArgumentError('token.client from model.getRefreshToken')
  if(client.id !== providedClient.id) throw new InvalidGrantError('Refresh Token is Invalid')
  if(!user) throw new MissingArgumentError('non-falsy token.user from model.getRefreshToken')
  if(refreshTokenExpiresAt) {
    if(!(refreshTokenExpiresAt instanceof Date)) throw new BadArgumentError('refreshTokenExpiresAt', 'must be an instance of Date when included in `model.getRefreshToken`')
    if(refreshTokenExpiresAt < new Date()) throw new InvalidGrantError('Refresh Token has expired')
  }
  return token
}

const revoke = async (token, revokeToken, alwaysIssueNewRefreshToken) => {
  if(!alwaysIssueNewRefreshToken) return token
  const status = await revokeToken(token)
  if(!status) throw new InvalidGrantError('Refresh Token is invalid')
  return token
}

const save = async (user, client, providedScope, model, accessTokenLifetime, refreshTokenLifetime, alwaysIssueNewRefreshToken) => {
  const sharedData = {user,client,scope: providedScope, model}
  let todos = [
    shared.generateAccessToken(sharedData),
    shared.getAccessTokenExpiresAt(accessTokenLifetime),
  ]
  if(alwaysIssueNewRefreshToken) {
    todos = [
      ...todos,
      shared.generateRefreshToken(sharedData),
      shared.getRefreshTokenExpiresAt(refreshTokenLifetime)
    ]
  } else {
    todos = [...todos, undefined, undefined]
  }

  const [
    accessToken,
    accessTokenExpiresAt,
    refreshToken,
    refreshTokenExpiresAt,
  ] = await Promise.all(todos)
  const token = {
    accessToken,
    accessTokenExpiresAt,
    refreshToken,
    refreshTokenExpiresAt,
  }
  return await model.saveToken(token, client, user)
}

const refreshToken = async (req, client, options) => {
  shared.verify(options)
  const {
    model,
    alwaysIssueNewRefreshToken,
    refreshTokenLifetime,
    accessTokenLifetime,
  } = options
  const {
    getRefreshToken,
    revokeToken,
    saveToken,
  } = model
  if (!getRefreshToken) throw new MissingArgumentError('model.getRefreshToken')
  if (!revokeToken) throw new MissingArgumentError('model.revokeToken')
  if (!saveToken) throw new MissingArgumentError('model.saveToken')
  const token = await getNewToken(req, client, getRefreshToken)
  await revoke(token, revokeToken, alwaysIssueNewRefreshToken)
  return await save(token.user, client, token.scope, model, accessTokenLifetime, refreshTokenLifetime, alwaysIssueNewRefreshToken)
}

module.exports = refreshToken
