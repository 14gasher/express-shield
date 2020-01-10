const {
  MissingArgumentError,
  InvalidGrantError,
} = require('../../../errors')
const shared = require('../shared')

const save = async (user, client, providedScope, model, accessTokenLifetime) => {
  const data = { user, client, scope: providedScope, model}
  const [
    scope,
    accessToken,
    accessTokenExpiresAt,
  ] = await Promise.all([
    shared.validateScope(data),
    shared.generateAccessToken(data),
    shared.getAccessTokenExpiresAt(accessTokenLifetime),
  ])
  const token = {
    scope,
    accessToken,
    accessTokenExpiresAt,
  }
  return await model.saveToken(token, client, user)
}

const clientCredentials = async (req,client, {model, accessTokenLifetime}) => {
  shared.verify(model)
  const {
    getUserFromClient,
    saveToken,
  } = model
  if (!getUserFromClient) throw new MissingArgumentError('model.getUserFromClient')
  if (!saveToken) throw new MissingArgumentError('model.saveToken')
  const scope = shared.getScope(req)
  const user = await getUserFromClient(client)
  if(!user) throw new InvalidGrantError('User Credentials are invalid')
  return await save(user, client, scope, model, accessTokenLifetime)
}

module.exports = clientCredentials
