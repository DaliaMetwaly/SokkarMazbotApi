const Router = require('koa-router');
const Koa = require('koa');
const koaSwagger = require('koa2-swagger-ui');
const cors = require('@koa/cors');
const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');
const errorHandler = require('./middlewares/error-handler');
const config = require('config');
const { version } = require('../package.json');
const v1 = require('./v1');

const app = new Koa();

app
  .use(errorHandler)
  .use(logger())
  .use(
    cors({
      ...config.get('cors')
    })
  )
  .use(bodyParser())
  .use(koaSwagger({
    routePrefix: '/swagger', // host at /swagger instead of default /docs
    swaggerOptions: {
      url: 'http://localhost:3005/1.0/swagger.json', // example path to json
    },
   })
  );

app.on('error', (err) => {
  // dont output stacktraces of errors that is throw with status as they are known
  if (!err.status || err.status === 500) {
    console.error(err.stack);
  }
});

const router = new Router();
router.get('/', (ctx) => {
  ctx.body = { version };
});
router.use('/1.0', v1.routes());


const spec=require('../config/swagger.json')
router.use(koaSwagger());
router.get('/1.0', koaSwagger({ routePrefix: false, swaggerOptions: { spec } }));

app.use(router.routes());
app.use(router.allowedMethods());

module.exports = app;
