const shared = require('../shared')

const saveAndValidateToken = async (user, client, authorizationCode, scope, model, accessLifetime, refreshLifetime) => {
  const data = { client, user, scope, model }
  const [
    validScope,
    accessToken,
    refreshToken,
    accessTokenExpiresAt,
    refreshTokenExpiresAt,
  ] = await Promise.all([
    shared.validateScope(data),
    shared.generateAccessToken(data),
    shared.generateRefreshToken(data),
    shared.getAccessTokenExpiresAt(accessLifetime),
    shared.getRefreshTokenExpiresAt(refreshLifetime),
  ])
  const token = {
    scope: validScope,
    authorizationCode,
    accessToken,
    refreshToken,
    accessTokenExpiresAt,
    refreshTokenExpiresAt,
  }
  return await model.saveToken(token, client, user)
}

module.exports = saveAndValidateToken
