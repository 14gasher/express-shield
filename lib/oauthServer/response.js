

class Response {
  constructor({
    body = {},
    headers = {},
  }) {
    let h = {}
    for (const header in headers) {
      if (headers.hasOwnProperty(header)) {
        h[header.toLowerCase()] = headers[header]
      }
    }
    Object.assign(this, {
      headers: h,
      body,
      status: 200,
    })
  }

  get(field) {
    return this.headers[field.toLowerCase()]
  }

  redirect(location) {
    this.set('Location', location)
    this.status = 302
  }

  set(field, value) {
    this.headers[field.toLowerCase()] = value
  }
}

module.exports = Response
