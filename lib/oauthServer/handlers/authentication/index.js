const {
  MissingArgumentError,
  BadArgumentError,
  InvalidTokenError,
  InsufficientScopeError,
} = require('../../errors')

const getTokenFromRequest = require('./getTokenFromRequest')

const AuthenticationHandler = async (req, res,{
  scope,
  model: {
    getAccessToken,
    verifyScope,
  },
  allowBearerTokensInQueryString,
  addAcceptedScopesHeader,
  addAuthorizedScopesHeader,
}) => {
  let accessToken
  try {
    const token = await getTokenFromRequest(req, allowBearerTokensInQueryString)
    accessToken = await getAccessToken(token)
    if (!accessToken) throw new MissingArgumentError('token in model.getAccessToken')
    if (!accessToken.user) throw new MissingArgumentError('token.user from model.getAccessToken')
    if (!accessToken.accessTokenExpiresAt instanceof Date) throw new BadArgumentError('token.accessTokenExpiresAt from model.getAccessToken', 'must be an instance of Date')
    if (accessToken.accessTokenExpiresAt < new Date()) throw new InvalidTokenError('Invalid token: Access token has expired')
    if (scope) {
      const verifiedScope = await verifyScope(accessToken)
      if (!verifiedScope) throw new InsufficientScopeError('Authorized Scope is insufficient')
    }
    if (scope && addAcceptedScopesHeader) {
      res.set('X-Accepted-OAuth-Scopes', scope)
    }
    if (scope && addAuthorizedScopesHeader) {
      res.set('X-OAuth-Scopes', accessToken.scope)
    }
  } catch(e) {
    res.set('WWW-Authenticate', 'Bearer realm="Service"')
    throw e
  }
  return accessToken
}

module.exports = AuthenticationHandler
