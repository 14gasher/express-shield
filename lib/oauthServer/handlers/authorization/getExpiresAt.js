const dateSecondsFromNow = seconds => {
  const d = new Date()
  d.setSeconds(d.getSeconds() + seconds)
  return d
}

module.exports = dateSecondsFromNow
