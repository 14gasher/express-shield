const {
  InvalidArgumentError,
} = require('../../errors')

const getTokenModel = ({
  accessToken,
  refreshToken,
  client,
  user,
  accessTokenExpiresAt,
  refreshTokenExpiresAt,
  scope,
  ...extendedAttributes
}, allowExtendedTokenAttributes = false) => {
  if (!accessToken) throw new InvalidArgumentError('Missing Parameter: `accessToken`')
  if (!client) throw new InvalidArgumentError('Missing Parameter: `accessToken`')
  if (!user) throw new InvalidArgumentError('Missing Parameter: `accessToken`')
  if (accessTokenExpiresAt && !(accessTokenExpiresAt instanceof Date)) throw new InvalidArgumentError('Invalid Parameter: `accessTokenExpiresAt` must be an instance of Date')
  if (refreshTokenExpiresAt && !(refreshTokenExpiresAt instanceof Date)) throw new InvalidArgumentError('Invalid Parameter: `refreshTokenExpiresAt` must be an instance of Date')
  const tokenModel = {
    accessToken,
    refreshToken,
    client,
    user,
    accessTokenExpiresAt,
    refreshTokenExpiresAt,
    scope,
    customAttributes: allowExtendedTokenAttributes ? extendedAttributes : undefined,
  }
  if (accessTokenExpiresAt) {
    tokenModel.accessTokenLifetime = Math.floor((accessTokenExpiresAt - new Date()) / 1000)
  }
  return tokenModel
}

module.exports = getTokenModel
