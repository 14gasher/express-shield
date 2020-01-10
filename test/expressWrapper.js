const should = require('chai').should()

const ExpressAuth = require('../lib/index').Express
const model = require('./support/model')

const ResponseExample = function () {
  this.headers = {}
  this.code = 500
  this.didRedirect = false

  this.set = headers => {
    this.headers = headers
    return this
  }
  this.status = code => {
    this.code = code
    return this
  }
  this.send = data => {
    this.sentData = data
    return this
  }

  this.redirect = () => {
    this.didRedirect = true
    return this
  }
}

describe('Express Wrapper', () => {
  let server
  it('should be able to boot up', () => {
    server = new ExpressAuth({
      oauthOptions: {
        model,
      },
    })
  })

  describe('authenticate', () => {
    it('Should return a middleware function', () => {
      const middleware = server.authenticate()
      middleware.should.be.a('function')
    })
  })

  describe('authorize', () => {
    it('Should return a middleware function', () => {
      const middleware = server.authorize()
      middleware.should.be.a('function')
    })
  })

  describe('token', () => {
    it('Should return a middleware function', () => {
      const middleware = server.token()
      middleware.should.be.a('function')
    })
  })

  describe('handleErrorResponse', () => {
    const myError = new Error('MESSAGE')
    myError.code = 500
    const oauthResponse = {
      headers: { h1: 1, h2: 2 }
    }

    it('should set headers correctly', () => {
      const expressResponse = new ResponseExample()
      server.handleErrorResponse(myError, expressResponse, () => { }, oauthResponse)
      expressResponse.headers.should.deep.equal(oauthResponse.headers)
    })

    it('should set status from error code', () => {
      const expressResponse = new ResponseExample()
      server.handleErrorResponse(myError, expressResponse, () => { }, oauthResponse)
      expressResponse.code.should.equal(myError.code)
    })

    it('should set response from error details', () => {
      const expressResponse = new ResponseExample()
      server.handleErrorResponse(myError, expressResponse, () => { }, oauthResponse)
      expressResponse.sentData.should.deep.equal({error: myError.name, error_description: myError.message})
    })
  })

  describe('handleResponse', () => {
    const oauthResponse = {
      headers: {h1: 1, h2: 2, location: 'myNewLocation'},
      status: 200,
      body: {test: 'pass'},
    }

    it('should redirect if status is 302', () => {
      const expressResponse = new ResponseExample()
      server.handleResponse(expressResponse, {...oauthResponse, status: 302})
      expressResponse.didRedirect.should.be.true
    })

    it('should set headers from oauthResponse.headers', () => {
      const expressResponse = new ResponseExample()
      server.handleResponse(expressResponse, oauthResponse)
      expressResponse.headers.should.deep.equal(oauthResponse.headers)
    })

    it('should set status from oauthResponse.status', () => {
      const expressResponse = new ResponseExample()
      server.handleResponse(expressResponse, oauthResponse)
      expressResponse.code.should.equal(oauthResponse.status)
      expressResponse.didRedirect.should.be.false
    })

  })

})
