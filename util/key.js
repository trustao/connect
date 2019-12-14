const keys = require('../list.json')

module.exports = function () {
  const i = keys[new Date().getDay()]
  return String(i)
}