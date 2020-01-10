const {
  InvalidScopeError,
} = require('../../errors')
const verifier = require('../../verifier')

const getScope = req => {
  const scope = req.body.scope || req.query.scope
  if (!verifier.isUnicodeWithExclamationSpace(scope)) throw new InvalidScopeError('Scope is not formatted properly')
  return scope
}

module.exports = getScope
