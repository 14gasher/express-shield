const {
  MissingArgumentError,
} = require('./errors')

const typeis = require('type-is')

class Request {
  constructor({
    headers,
    method,
    query,
    body = {},
    ...rest
  }) {
    if(!headers) throw new MissingArgumentError('headers')
    if(!method) throw new MissingArgumentError('method')
    if(!query) throw new MissingArgumentError('query')
    let h = {}
    for (const header in headers) {
      if (headers.hasOwnProperty(header)) {
        h[header.toLowerCase()] = headers[header]
      }
    }
    Object.assign(this, {
      headers: h,
      method,
      query,
      body,
    })
    for (const key in rest) {
      if (rest.hasOwnProperty(key) && !this[key]) {
        this[key] = rest[key]
      }
    }
  }

  get(field) {
    return this.headers[field.toLowerCase()]
  }

  is(types) {
    const t = Array.isArray(types) ? types : [].slice.call(arguments)
    return typeis(this,t)
  }
}

module.exports = Request
