const Koa = require('koa');
const app = new Koa();
const auth = require('./auth');
const fetchData = require('./fetchData')
const message = require('./message')
const cors = require('@koa/cors');

app.use(cors())
// logger
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (e) {
    console.error(e)
    ctx.body = message(e.toString(), 2)
  }
  const rt = ctx.response.get('X-Response-Time');
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});


// x-response-time
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

app.use(auth)
app.use(fetchData)

app.listen(50099);