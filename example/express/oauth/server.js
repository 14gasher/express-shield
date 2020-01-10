const OAuthServer = require('../../../lib').Express
const model = require('../../model')

module.exports = new OAuthServer({
  oauthOptions: {
    model: model,
    grants: ['authorization_code', 'refresh_token'],
    accessTokenLifetime: 60 * 60 * 24, // 24 hours, or 1 day
    allowEmptyState: true,
    allowExtendedTokenAttributes: true,
    alwaysIssueNewRefreshToken: true,
  },
  continueMiddleware: false,
})
