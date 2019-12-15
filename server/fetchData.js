const message = require('./message')
const getKey = require('../util/key')
const { request } = require('../util/axios')
const {aesDecrypt, aesEncrypt} = require('../util/lock')
const {parse} = require('./parse')
const {BASE_URL}　=　require('../config')

module.exports = {
  searchData: async (ctx) => {
  const k = ctx.query.k
  if (k) {
    const {data} = await search(k)
    const res = parse(data, type)
    ctx.body = message(aesEncrypt(res, getKey()), 0)
  } else {
    ctx.body = message('', 1);
  }
},
  fetchData: async function (ctx, next) {
    const { l, type } = ctx.query
    if (l) {
      const link = aesDecrypt(l, getKey())
      console.log(link)
      const { status, data } = await request(BASE_URL + link)
      if (status !== 200) {
        ctx.body = message('', 5)
      } else {
        const res = parse(data, type)
        ctx.body = message(aesEncrypt(res, getKey()), 0)
        // ctx.body = message(res, 0)
      }
    } else {
      ctx.body = message({l}, 6)
    }
  }
}