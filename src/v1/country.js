const Router = require('koa-router');
const Joi = require('joi');
const validate = require('../middlewares/validate');
const countryModel = require('../models/country');
const authenticate = require('../middlewares/authenticate');
const router = new Router();


const fetchAllCountry = async (ctx, next) => {
    ctx.state.allCountry =  await countryModel.find({});
    if (!ctx.state.allCountry) ctx.throw(500, "can't get all country ");
    await next();
};

router
  .post(
    '/add',
    validate({
      body: {
          title: Joi.string().required()
      }
    }),
    async (ctx) => {     
      const country = await countryModel.create({
        ...ctx.request.body,
      });

      ctx.body = { data: {country:country } };
    }
  );
  
router
    .use(authenticate({ type: 'user' }))
    .use(fetchAllCountry)
    .get('/all', (ctx) => {
        ctx.body = { data: ctx.state.allCountry };
    });
module.exports = router;
