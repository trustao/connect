const Koa = require('koa');
const app = new Koa();
const auth = require('./auth');
const message = require('./message')
const cors = require('koa-cors');
const router = require('./routes')
const {getClientIP} = require('../util/index')

app.use(cors())
// logger
app.use(async (ctx, next) => {
  console.log(`[REQ] => ${ctx.method} ${ctx.url} Form: [${getClientIP(ctx.req)}]`)
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