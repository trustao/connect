const router = require('koa-router')();
const message = require('./message')
const {fetchData, searchData} = require('./fetchData')
const {search} = require('../util/axios')
router.get('/l',
  (ctx) => {
    ctx.body = message('ok', 0);
  }
);

router.get('/s', searchData);

router.get('/g', fetchData);

router.get('*',
  (ctx) => {
    ctx.body = message('', 1)
  }
);

module.exports = router