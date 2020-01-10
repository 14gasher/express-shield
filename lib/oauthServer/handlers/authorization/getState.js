const {
  InvalidRequestError,
} = require('../../errors')
const verifier = require('../../verifier')

const getState = (req, allowEmptyState) => {
  const state = req.body.state || req.query.state
  if (!allowEmptyState && !state) throw new InvalidRequestError('state is required in the request query or body.')
  if (!verifier.isPrintableUnicode(state)) throw new InvalidRequestError('state must consist of printable unicode characters.')
  return state
}

module.exports = getState
