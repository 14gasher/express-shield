const {
  AccessDeniedError,
} = require('../../errors')

const buildErrorRedirectUri = require('./buildErrorUri')
const generateAuthorizationCode = require('./generateAuthorizationCode')
const getExpiresAt = require('./getExpiresAt')
const getRedirectUri = require('./getRedirectUri')
const getScope = require('./getScope')
const getState = require('./getState')
const getUriBuilderFromResponseType = require('./getUriBuilderFromResponseType')
const getValidClient = require('./getValidClient')
const getValidUser = require('./getValidUser')
const updateResponse = require('./updateResponse')

const authorizeHandler = async (req, res, {
  model: {
    getClient,
    saveAuthorizationCode,
  },
  authorizationCodeLifetime,
  allowEmptyState,
  authenticateHandler,
}) => {
  if (req.query.allowed === 'false') throw new AccessDeniedError('Access Denied: User denied access to application')
  const [expiresAt, client, user] = await Promise.all([
    getExpiresAt(authorizationCodeLifetime),
    getValidClient(req, getClient),
    getValidUser(req,res, authenticateHandler),
  ])
  const uri = getRedirectUri(req, client)
  const state = getState(req, allowEmptyState)
  let code
  try {
    const scope = getScope(req)
    const authorizationCode = await generateAuthorizationCode(client, user, scope)
    code = await saveAuthorizationCode({
      authorizationCode,
      expiresAt,
      scope,
      redirectUri: uri,
    }, client, user)
    const buildSuccessRedirectUri = getUriBuilderFromResponseType(req)
    const redirectUri = buildSuccessRedirectUri(uri, code.authorizationCode)
    updateResponse(res, redirectUri, state)
  } catch(e) {
    const redirectUri = buildErrorRedirectUri(uri, e)
    updateResponse(res,redirectUri, state)
    throw e
  }
  return code
}

module.exports = authorizeHandler
