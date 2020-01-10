const url = require('url')

const updateResponse = (res, redirectUri, state) => {
  redirectUri.query = {
    ...redirectUri.query,
    state,
  }
  res.redirect(url.format(redirectUri))
}

module.exports = updateResponse
