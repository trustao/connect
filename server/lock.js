const {aesDecrypt, aesEncrypt} = require('../util/lock')
const getKey = require('../util/key')
const message = require('./message')

module.exports = async (ctx, next) => {
  const {query} = ctx
  Object.keys(query).forEach(key => {
    query[key] = aesDecrypt(query[key], getKey())
  })
  await next()
  if (ctx.$$$body) {
    ctx.body = message(aesEncrypt(JSON.stringify(ctx.$$$body), getKey()), 0)
  }
}
