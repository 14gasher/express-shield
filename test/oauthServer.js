const should = require('chai').should()

const OAuthServer = require('../lib/index').OAuth.Server
const model = require('./support/model')


describe('OAuth Server', () => {
  let server
  it('should be able to boot up', () => {
    server = new OAuthServer({
      model,
    })
  })

  describe('authenticate', () => {
    it('should not work with no model', () => {
      (() => server.authenticate(null, null, { model: null })).should.throw()
    })
  })

  describe('authorize', () => {
    it('should not work with no model', () => {
      (() => server.authorize(null, null, { model: null })).should.throw()
    })
  })

  describe('token', () => {
    it('should not work with no model', () => {
      (() => server.token(null, null, { model: null })).should.throw()
    })
  })
})
