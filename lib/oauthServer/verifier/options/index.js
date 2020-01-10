const {
  MissingArgumentError,
} = require('../../errors')
const notDefinedError = thing => { throw new MissingArgumentError(thing) }
const scopeAndNotDefinedError = thing => { throw new MissingArgumentError(`${thing} with a defined scope`) }

function verifyAuthenticateOptions({
  model,
  scope,
}) {
  if (!model) notDefinedError('model')
  const {
    getAccessToken,
    addAcceptedScopesHeader,
    addAuthorizedScopesHeader,
    verifyScope,
  } = model
  if (!getAccessToken) scopeAndNotDefinedError('model.getAccessToken')
  if (scope && !addAcceptedScopesHeader) scopeAndNotDefinedError('model.getAccessToken')
  if (scope && !addAuthorizedScopesHeader) scopeAndNotDefinedError('model.getAccessToken')
  if (scope && !verifyScope) scopeAndNotDefinedError('model.getAccessToken')
  return true
}

function verifyAuthorizationOptions({
  model,
  authenticateHandler,
  authorizationCodeLifetime
}) {
  if (!model) notDefinedError('model')
  const {
    getClient,
    saveAuthorizationCode,
  } = model
  if (authenticateHandler && !authenticateHandler.handle) notDefinedError('authenticateHandler.handle')
  if (!authorizationCodeLifetime) notDefinedError('authorizationCodeLifetime')
  if (!getClient) notDefinedError('model.getClient')
  if (!saveAuthorizationCode) notDefinedError('model.saveAuthorizationCode')
  return true
}

function verifyTokenOptions({
  model,
  accessTokenLifetime,
  refreshTokenLifetime,
}) {
  if (!model) notDefinedError('model')
  const {
    getClient
  } = model
  if (!accessTokenLifetime) notDefinedError('accessTokenLifetime')
  if (!refreshTokenLifetime) notDefinedError('refreshTokenLifetime')
  if (!getClient) notDefinedError('model.getClient')
  return true
}

module.exports = {
  authentication: verifyAuthenticateOptions,
  authorization: verifyAuthorizationOptions,
  token: verifyTokenOptions,
}
