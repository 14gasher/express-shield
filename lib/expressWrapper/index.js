const {
  Server: OAuth,
  Request,
  Response,
  Errors: {
    UnauthorizedRequestError,
  }
} = require('../oauthServer')

class ExpressWrapper {
  constructor({
    oauthOptions,
    useErrorHandler = false,
    continueMiddleware = false,
  }) {
    this.server = new OAuth(oauthOptions)
    this.useErrorHandler = useErrorHandler
    this.continueMiddleware = continueMiddleware
  }

  handleErrorResponse(e, res, next, response) {
    if (this.useErrorHandler) return next(e)
    if (response) res.set(response.headers)
    return res
      .status(e.code)
      .send(e instanceof UnauthorizedRequestError ? null : {
        error: e.name,
        error_description: e.message,
      })
  }

  handleResponse(res, response) {
    if(response.status === 302) {
      const l = response.headers.location
      delete response.headers.location
      res.set(response.headers)
      return res.redirect(l)
    }
    res.set(response.headers)
    return res.status(response.status).send(response.body)
  }

  authenticate(options) {
    return async (req,res,next) => {
      const request = new Request(req)
      const response = new Response(res)
      let token
      try {
        token = await this.server.authenticate(request, response, options)
      } catch(e) {
        return this.handleErrorResponse(e, res, next, response)
      }
      res.locals.oauth = {token}
      return next()
    }
  }

  authorize(options) {
    return async (req,res,next) => {
      const request = new Request(req)
      const response = new Response(res)
      let code
      try {
        code = await this.server.authorize(request, response, options)
      } catch(e) {
        return this.handleErrorResponse(e,res,next,response)
      }
      res.locals.oauth = { code }
      if (this.continueMiddleware) return next()
      return this.handleResponse(res, response)
    }
  }

  token(options) {
    return async (req,res,next) => {
      const request = new Request(req)
      const response = new Response(res)
      let token
      try {
        token = await this.server.token(request, response, options)
      } catch(e) {
        return this.handleErrorResponse(e,res,next,response)
      }
      res.locals.oauth = { token }
      if (this.continueMiddleware) return next()
      return this.handleResponse(res,response)
    }
  }
}

module.exports = ExpressWrapper
