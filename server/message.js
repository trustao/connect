const info = {
  '0': 'SUCCESS',
  '1': 'Not found',
  '2': 'Service Error',
  '4': 'Not Allow',
  '5': 'Fetch Error',
  '6': 'Params Error',
  '7': 'ERROR'
}

module.exports = function message (data, status = 7, msg) {
  return JSON.stringify({
    code: status,
    msg: msg || info[status],
    data
  })
}