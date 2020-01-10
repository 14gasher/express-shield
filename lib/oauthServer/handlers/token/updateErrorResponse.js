const updateErrorResponse = (e, res) => {
  res.body = {
    error: error.name,
    error_description: error.message,
  }

  res.status = error.code
}

module.exports = updateErrorResponse
