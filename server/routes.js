const router = require('koa-router')();
const message = require('./message')
const fetchData = require('./fetchData')

router.get('/l',
  (ctx) => {
    ctx.body = message('ok', 0);
  }
);

router.get('/g', fetchData);

router.get('*',
  (ctx) => {
    ctx.body = message('', 1)
  }
);

module.exports = router