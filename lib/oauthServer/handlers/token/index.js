const {
  InvalidRequestError,
} = require('../../errors')

const basicGrantTypes = require('../grantTypes')
const getValidClient = require('./getValidClient')
const updateErrorResponse = require('./updateErrorResponse')
const handleGrant = require('./handleGrant')
const getTokenModel = require('./getTokenModel')
const getTokenType = require('./getTokenType')
const updateSuccessResponse = require('./updateSuccessResponse')

const tokenHandler = async (req,res, {
  accessTokenLifetime,
  refreshTokenLifetime,
  extendedGrantTypes,
  allowExtendedTokenAttributes,
  requireClientAuthentication = {},
  alwaysIssueNewRefreshToken,
  model,
}) => {
  const {
    getClient
  } = model
  const grantTypes = {...basicGrantTypes, ...extendedGrantTypes}
  if(req.method !== 'POST') throw new InvalidRequestError('Method MUST be POST')
  if (!req.is('application/x-www-form-urlencoded')) throw new InvalidRequestError('Content must be encoded via the application/x-www-form-urlencoded header')
  let client
  try {
    client = await getValidClient(req, res, getClient, requireClientAuthentication)
  } catch(e) {
    updateErrorResponse(e, res)
    throw e
  }
  const grantData = await handleGrant(req, client, grantTypes, accessTokenLifetime, refreshTokenLifetime, model, alwaysIssueNewRefreshToken)
  const tokenModel = getTokenModel(grantData, allowExtendedTokenAttributes)
  const tokenType = getTokenType(tokenModel)
  updateSuccessResponse(res, tokenType)
}

module.exports = tokenHandler
