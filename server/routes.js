const router = require('koa-router')();
const message = require('./message')
const {fetchData, searchData} = require('./fetchData')
const {customRequest} = require('../util/axios')
const lock = require('./lock')
router.get('/l',
  (ctx) => {
    ctx.body = message('ok', 0);
  }
);

router.get('/s', searchData);

router.get('/g', fetchData);

router.use('/r', lock, async (ctx) => {
  const {protocol, host, path} = JSON.parse(ctx.query.l) || {}
  console.log(protocol, host, path)
  if ([protocol, host, path].some(i => !i)) return
  const {data} = await customRequest(protocol, host, path)
  ctx.$$$body = data
})


router.get('*',
  (ctx) => {
    ctx.body = message('', 1)
  }
);

module.exports = router