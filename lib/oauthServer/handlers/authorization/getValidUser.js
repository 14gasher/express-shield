const {
  ServerError,
} = require('../../errors')
const getValidUser = async (req, res, authenticateHandler) => {
  if (!authenticateHandler) return {}
  const user = await authenticateHandler.handle(req, res)
  if (!user) throw new ServerError('`authenticateHandler.handle` did not return a non-falsy user object')
  return user
}

module.exports = getValidUser
