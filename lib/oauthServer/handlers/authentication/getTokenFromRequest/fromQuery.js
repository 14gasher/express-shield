const {InvalidRequestError} = require('../../../errors')
// http://tools.ietf.org/html/rfc6750#section-2.3
module.exports = (token, allowBearerTokensInQueryString = false) => {
  if (allowBearerTokensInQueryString) return token
  throw new InvalidRequestError('Do not send bearer tokens in query URLs','Bearer Tokens in Query URLs are insecure and a bad practice. You can override this by adding the allowBearerTokensInQueryString to the options.')
}
