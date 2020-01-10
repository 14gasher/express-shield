const {
  MissingArgumentError,
} = require('../../errors')
const url = require('url')

const responseTypes = {
  code: (redirectUri, code) => {
    if (!code) throw new MissingArgumentError('code')
    if (!redirectUri) throw new MissingArgumentError('redirectUri')
    const uri = url.parse(redirectUri, true)
    uri.query.code = code
    uri.search = null
    return uri
  },
}

module.exports = responseTypes
