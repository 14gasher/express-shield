const url = require('url')

const buildErrorRedirectUri = (redirectUri, error) => {
  const uri = url.parse(redirectUri)
  uri.query = { error: error.name, error_description: error.message }
  return uri
}

module.exports = buildErrorRedirectUri
