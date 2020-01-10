const responseTypes = require('./responseTypes')
const {
  InvalidRequestError,
  UnsupportedResponseTypeError,
} = require('../../errors')

const getUriBuilderFromResponseType = req => {
  const responseType = req.body.response_type || req.query.responseType
  if (!responseType) throw new InvalidRequestError('Mising Parameter: `response_type`. Please include an appropriate response_type in your request body or url query')
  const uriBuilder = responseTypes[responseType]
  if (!uriBuilder) throw new UnsupportedResponseTypeError('Unsupported Response Type: provided `response_type` is not supported.')
  return uriBuilder
}

module.exports = getUriBuilderFromResponseType
