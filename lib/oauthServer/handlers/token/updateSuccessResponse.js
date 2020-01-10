const updateSuccessResponse = (res, tokenType) => {
  res.body = tokenType
  res.set('Cache-Control', 'no-store')
  res.set('Pragma', 'no-cache')
}
module.exports = updateSuccessResponse
