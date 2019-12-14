const {md5} = require('../util/lock')
const getKey = require('../util/key')
const message = require('./message')

module.exports = async function (ctx, next) {
  const authKey = ctx.headers['t-k']
  if (authKey === md5(getKey())) {
    await next()
  } else {
    ctx.body = message('', 4)
  }
}