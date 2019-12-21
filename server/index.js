const Koa = require('koa');
const app = new Koa();
const auth = require('./auth');
const message = require('./message')
const cors = require('koa-cors');
const router = require('./routes')
const {getClientIP, dateFormat} = require('../util/index')
const compress = require('koa-compress')
app.use(cors())
app.use(compress({
  filter: function (content_type) {
    return /text/i.test(content_type)
  },
  threshold: 2048,
  flush: require('zlib').Z_SYNC_FLUSH
}))
// logger
app.use(async (ctx, next) => {
  console.log(`[REQ] => ${ctx.method} ${ctx.url} Form: [${getClientIP(ctx.req)}] Time: ${dateFormat(new Date())}`)
  try {
    await next();
  } catch (e) {
    console.error(e)
    ctx.body = message(e.toString(), 2)
  }
  const rt = ctx.response.get('X-Response-Time');
  console.log(`[RES] <= ${ctx.url} - ${rt}`);
});

// x-response-time
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

app.use(auth)
app.use(router.routes());

app.listen(50099);