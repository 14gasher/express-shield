const getTokenType = (tokenModel) => {
  return {
    access_token: tokenModel.accessToken,
    token_type: 'Bearer',
    expires_in: tokenModel.accessTokenLifetime,
    refresh_token: tokenModel.refreshToken,
    scope: tokenModel.scope,
    ...tokenModel.customAttributes,
  }
}

module.exports = getTokenType
