const {
  InvalidRequestError,
  InvalidGrantError,
  MissingArgumentError,
} = require('../../../errors')

const verifier = require('../../../verifier')


const shared = require('../shared')

const getValidUser = async (req, getUser) => {
  const {
    username,
    password,
  } = req.body
  if(!username) throw new InvalidRequestError('Missing Parameter: `username`')
  if(!password) throw new InvalidRequestError('Missing Parameter: `password`')
  if (!verifier.isUnicodeWithoutNewline(username)) throw new InvalidRequestError('Invalid Parameter: `username`.', 'Must be unicode without newline characters.')
  if (!verifier.isUnicodeWithoutNewline(password)) throw new InvalidRequestError('Invalid Parameter: `password`.', 'Must be unicode without newline characters.')
  const user = await getUser(username, password)
  if(!user) throw new InvalidGrantError('User Credentials are invalid')
  return user
}

const save = async (user, client, providedScope, model, accessCodeLifetime, refreshCodeLifetime) => {
  const sharedData = {user, client, scope: providedScope, model }
  const [
    scope,
    accessToken,
    refreshToken,
    accessTokenExpiresAt,
    refreshTokenExpiresAt,
  ] = await Promise.all([
    shared.validateScope(sharedData),
    shared.generateAccessToken(sharedData),
    shared.generateRefreshToken(sharedData),
    shared.generateAccessToken(accessCodeLifetime),
    shared.getRefreshTokenExpiresAt(refreshCodeLifetime),
  ])
  const token = {
    scope,
    accessToken,
    refreshToken,
    accessTokenExpiresAt,
    refreshTokenExpiresAt,
  }
  return await model.saveToken(token, client, user)
}

const password = async (req, client, options) => {
  shared.verify(options)
  const {
    model,
    accessCodeLifetime,
    refreshCodeLifetime,
  } = options
  const {
    getUser,
    saveToken,
  } = model
  if (!getUser) throw MissingArgumentError('model.getUser')
  if (!saveToken) throw MissingArgumentError('model.saveToken')
  const scope = shared.getScope(req)
  const user = await getValidUser(req, getUser)
  return await save(user, client, scope, model, accessCodeLifetime, refreshCodeLifetime)
}

module.exports = password
