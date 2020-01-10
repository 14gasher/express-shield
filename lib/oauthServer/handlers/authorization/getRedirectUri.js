const getRedirectUri = (req, client) => req.body.redirect_uri || req.query.redirect_uri || client.redirectUris[0]

module.exports = getRedirectUri
