const verifier = require('../../../verifier')
const {
  InvalidRequestError,
} = require('../../../errors')

const validateUri = (req, code) => {
  if (!code.redirectUri) return
  const redirectUri = req.body.redirect_uri || req.query.redirect_uri
  if (!verifier.isUri(redirectUri)) throw new InvalidRequestError('`redirect_uri` is invalid')
  if (redirectUri != code.redirectUri) throw new InvalidRequestError('`redirect_uri` is invalid')
}

module.exports = validateUri
