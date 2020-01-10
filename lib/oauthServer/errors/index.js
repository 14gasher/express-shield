const captureErrorTrace = (errInstance, errClass) => {
  Error.captureStackTrace(errInstance, errClass)
}

class OAuthError extends Error {
  constructor(err, properties = { code: 500, name: 'OAuthError', extendedMessage: '', }) {
    const msg = err instanceof Error ? err.message : err
    super(msg)
    Object.assign(this, properties)
    this.code = this.status = this.statusCode = properties.code
    if (!this.extendedMessage) this.extendedMessage = msg
    captureErrorTrace(this, OAuthError)
  }

  getDebugInfo() { return this.extendedMessage }
}

class AccessDeniedError extends OAuthError {
  constructor(reasonForDenial, extendedMessage) {
    super('AccessDeniedError: ' + reasonForDenial, { code: 400, name: 'access_denied', extendedMessage })
    captureErrorTrace(this, AccessDeniedError)
  }
}

class InsufficientScopeError extends OAuthError {
  constructor(reasonForDenial, extendedMessage) {
    super('InsufficientScopeError: ' + reasonForDenial, { code: 403, name: 'insufficient_scope', extendedMessage })
    captureErrorTrace(this, InsufficientScopeError)
  }
}

class ServerError extends OAuthError {
  constructor(reasonForDenial, extendedMessage) {
    super('ServerError: ' + reasonForDenial, { code: 500, name: 'server_error', extendedMessage })
    captureErrorTrace(this, ServerError)
  }
}

class InvalidArgumentError extends ServerError {
  constructor(reasonForDenial, extendedMessage) {
    super('InvalidArgumentError: ' + reasonForDenial, { code: 500, name: 'invalid_argument', extendedMessage })
    captureErrorTrace(this, InvalidArgumentError)
  }
}

class MissingArgumentError extends InvalidArgumentError {
  constructor(missingArgument) {
    super(`'${missingArgument}' is not present.`, `Please refer to the documentation for '${missingArgument}'.`)
    captureErrorTrace(this, MissingArgumentError)
  }
}

class BadArgumentError extends InvalidArgumentError {
  constructor(badArgument, reasonBad) {
    super(`'${badArgument}' is not valid.`, `${badArgument} is not valid. ${reasonBad}. Please refer to the documentation for '${missingArgument}'.`)
    captureErrorTrace(this, BadArgumentError)
  }
}

class InvalidClientError extends OAuthError {
  constructor(reasonForDenial, extendedMessage) {
    super('InvalidClientError: ' + reasonForDenial, { code: 400, name: 'invalid_client', extendedMessage })
    captureErrorTrace(this, InvalidClientError)
  }
}

class InvalidGrantError extends OAuthError {
  constructor(reasonForDenial, extendedMessage) {
    super('InvalidGrantError: ' + reasonForDenial, { code: 400, name: 'invalid_grant', extendedMessage })
    captureErrorTrace(this, InvalidGrantError)
  }
}

class InvalidRequestError extends OAuthError {
  constructor(reasonForDenial, extendedMessage) {
    super('InvalidRequestError: ' + reasonForDenial, { code: 400, name: 'invalid_request', extendedMessage })
    captureErrorTrace(this, InvalidRequestError)
  }
}

class InvalidScopeError extends OAuthError {
  constructor(reasonForDenial, extendedMessage) {
    super('InvalidScopeError: ' + reasonForDenial, { code: 400, name: 'invalid_scope', extendedMessage })
    captureErrorTrace(this, InvalidScopeError)
  }
}

class InvalidTokenError extends OAuthError {
  constructor(reasonForDenial, extendedMessage) {
    super('InvalidTokenError: ' + reasonForDenial, { code: 401, name: 'invalid_token', extendedMessage })
    captureErrorTrace(this, InvalidTokenError)
  }
}

class UnauthorizedClientError extends OAuthError {
  constructor(reasonForDenial, extendedMessage) {
    super('UnauthorizedClientError: ' + reasonForDenial, { code: 400, name: 'unauthorized_client', extendedMessage })
    captureErrorTrace(this, UnauthorizedClientError)
  }
}

class UnauthorizedRequestError extends OAuthError {
  constructor(reasonForDenial, extendedMessage) {
    super('UnauthorizedRequestError: ' + reasonForDenial, { code: 401, name: 'unauthorized_request', extendedMessage })
    captureErrorTrace(this, UnauthorizedRequestError)
  }
}

class UnsupportedGrantTypeError extends OAuthError {
  constructor(reasonForDenial, extendedMessage) {
    super('UnsupportedGrantTypeError: ' + reasonForDenial, { code: 400, name: 'unsupported_grant_type', extendedMessage })
    captureErrorTrace(this, UnsupportedGrantTypeError)
  }
}

class UnsupportedResponseTypeError extends OAuthError {
  constructor(reasonForDenial, extendedMessage) {
    super('UnsupportedResponseTypeError: ' + reasonForDenial, { code: 400, name: 'unsupported_response_type', extendedMessage })
    captureErrorTrace(this, UnsupportedResponseTypeError)
  }
}





module.exports = {
  OAuthError,
  AccessDeniedError,
  InsufficientScopeError,
  InvalidArgumentError,
  MissingArgumentError,
  BadArgumentError,
  InvalidClientError,
  InvalidGrantError,
  InvalidRequestError,
  InvalidScopeError,
  InvalidTokenError,
  ServerError,
  UnauthorizedClientError,
  UnauthorizedRequestError,
  UnsupportedResponseTypeError,
  UnsupportedGrantTypeError,
}
