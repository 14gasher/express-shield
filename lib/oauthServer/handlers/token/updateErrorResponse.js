const updateErrorResponse = (e, res) => {
  res.body = {
    error: e.name,
    error_description: e.message,
  }

  res.status = e.code
}

module.exports = updateErrorResponse
