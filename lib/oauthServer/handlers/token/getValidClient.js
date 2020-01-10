const auth = require('basic-auth')

const {
  InvalidClientError,
  MissingArgumentError,
  BadArgumentError,
} = require('../../errors')
const verifier = require('../../verifier')

const getClientAuthenticationRequired = (grantType, requiredGrantTypes) => requiredGrantTypes[grantType] === undefined ? true : requiredGrantTypes[grantType]

const getCredentials = req => {
  const {
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: grantType,
  } = req.body
  const cred = auth(req)
  if (cred) return { clientId: cred.name, clientSecret: cred.pass, grantType }

  if (clientId && clientSecret) return { clientId, clientSecret, grantType }
  if (!getClientAuthenticationRequired(grantType, requiredGrantTypes) && clientId) return { clientId, grantType }
  throw new InvalidClientError('Cannot retrieve client credentials. Examined the Authorization header and the body. Please see the documentation for more information.')
}


const getValidClient = async (req, res, getClient, requiredGrantTypes) => {
  const { clientId, clientSecret, grantType } = getCredentials(req)
  if (!verifier.isPrintableUnicode(clientId)) throw new InvalidClientError('`client_id` contains non-printable characters. Ensure that it contains only printable unicode characters')
  if (clientSecret && !verifier.isPrintableUnicode(clientSecret)) throw new InvalidClientError('`client_secrete` contains non-printable characters. Ensure it contains only printable unicode characters')
  let client
  try {
    client = await getClient(clientId, clientSecret)
  } catch (e) {
    if ((e instanceof InvalidClientError) && request.get('authorization')) {
      res.set('WWW-Authenticate', 'Basic realm="Service"')
      throw new InvalidClientError(e, { code: 401 })
    }
    throw e
  }
  if (!client) throw new InvalidClientError('Client is invalid')
  if (!client.grants) throw new MissingArgumentError('client.grants from model.getClient')
  if (!Array.isArray(client.grants)) throw new BadArgumentError('client.grants from model.getClient','`grants` in client must be an array. See getClient for more information')
  return client
}

module.exports = getValidClient
