const {
  InvalidRequestError,
  InvalidClientError,
  UnsupportedGrantError,
} = require('../../errors')
const verifier = require('../../verifier')

const handleGrant = async (req, client, grantTypes, accessTokenLifetime, refreshTokenLifetime, model, alwaysIssueNewRefreshToken) => {
  const grantType = req.body.grant_type
  if (!grantType) throw new InvalidRequestError('Missing Parameter: `grant_type`')
  if (!verifier.isUnicode(grantType) && !verifier.isUri(grantType)) throw new InvalidRequestError('Invalid Parameter: `grant_type` is either not unicode or a properly formed url.')
  const grantHandler = grantTypes[grantType]
  if (!grantHandler) throw new UnsupportedGrantError(grantType)
  if (!client.grants.includes(grantType)) throw new InvalidClientError('`grant_type` is not valid for this client')

  const aTokenLife = client.accessTokenLifetime || accessTokenLifetime
  const rTokenLife = client.refreshTokenLifetime || refreshTokenLifetime
  return await grantHandler(req, client, {
    accessTokenLifetime: aTokenLife,
    refreshTokenLifetime: rTokenLife,
    model,
    alwaysIssueNewRefreshToken,
  })
}

module.exports = handleGrant
