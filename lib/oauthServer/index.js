const AuthenticateHandler = require('./handlers/authentication')
const AuthorizeHandler = require('./handlers/authorization')
const TokenHandler = require('./handlers/token')

const verifyOptions = require('./verifier/options')

class OAuth {
  constructor({
    model,
    scope = false,
    // Authenticate Default Options
    addAcceptedScopesHeader = true,
    addAuthorizedScopesHeader = true,
    allowBearerTokensInQueryString = false,
    // Authorization Default Options
    allowEmptyState = false,
    authorizationCodeLifetime = 5 * 60,
    // Token Default Options
    accessTokenLifetime = 60 * 60,
    refreshTokenLifetime = 60 * 60 * 24 * 14,
    allowExtendedTokenAttributes = false,
    requireClientAuthentication = {
      authorizationCode: true,
      password: true,
      refreshToken: true,
    },
    alwaysIssueNewRefreshToken = true,
    ...rest
  }) {
    this.options = {
      model,
      scope,
      addAcceptedScopesHeader,
      addAuthorizedScopesHeader,
      allowBearerTokensInQueryString,
      allowEmptyState,
      authorizationCodeLifetime,
      accessTokenLifetime,
      refreshTokenLifetime,
      allowExtendedTokenAttributes,
      requireClientAuthentication,
      alwaysIssueNewRefreshToken,
      ...rest
    }
  }

  authenticate(req, res, authenticateOptions) {
    const options = {
      ...this.options,
      ...authenticateOptions,
    }
    verifyOptions.authentication(options)
    return AuthenticateHandler(req, res, options)
  }

  authorize(req, res, authorizeOptions) {
    const options = {
      ...this.options,
      ...authorizeOptions,
    }
    verifyOptions.authorization(options)
    return AuthorizeHandler(req, res, options)
  }

  token(req, res, tokenOptions) {
    const options = {
      ...this.options,
      ...tokenOptions,
    }
    verifyOptions.token(options)
    return TokenHandler(req, res, options)
  }
}

module.exports = {
  Server: OAuth,
  Request: require('./request'),
  Response: require('./response'),
  Errors: require('./errors'),
}
