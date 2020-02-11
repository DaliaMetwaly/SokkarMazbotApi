const Router = require('koa-router');
const Joi = require('joi');
const validate = require('../middlewares/validate');
const mealTypeModel = require('../models/mealtype');
const authenticate = require('../middlewares/authenticate');
const router = new Router();

router.post(
  '/add',
  validate({
    body: {
        title:      Joi.string().required(),
        percentage: Joi.string().required()
    }
  }),
  authenticate({ type: 'user' }),
  async (ctx) => {     
    const mealType = await mealTypeModel.create({
      ...ctx.request.body,
    });

    ctx.body = { data: {mealType:mealType } };
  }
).post(
  '/delete',
  authenticate({ type: 'user' }),
  async (ctx) => {     
    const  id = ctx.request.body;
    ctx.state.deletedMealType =  await mealTypeModel.findByIdAndRemove(id.Id);
    if (!ctx.state.deletedMealType) ctx.throw(500, "can't delete this Meal Type ");
    ctx.body = { data:  ctx.state.deletedMealType };
  }
).get(
  '/all',
  authenticate({ type: 'user' }),
  async (ctx) => {     
    ctx.state.allMealType =  await mealTypeModel.find({});
    if (!ctx.state.allMealType) ctx.throw(500, "can't get all meal types ");
    ctx.body = { data: ctx.state.allMealType };
  }
).get(
  '/getinfo',
  authenticate({ type: 'user' }),
  async (ctx) => {     
    const  id = ctx.request.query.id
    ctx.state.mealType =await mealTypeModel.find({_id:id});
    if (!ctx.state.mealType) ctx.throw(500, "can't get meal type info ");
    ctx.body = { data: ctx.state.mealType};
  }
).post(
  '/update',
  authenticate({ type: 'user' }),
  async (ctx) => {     
    const  {id,title,percentage} =ctx.request.body;
    ctx.state.mealType = await mealTypeModel.findById(id);
    if (!ctx.state.mealType) ctx.throw(500, 'Meal type associsated to token could not not be found');
    ctx.state.mealType.title = title;
    ctx.state.mealType.percentage = percentage;
    await ctx.state.mealType.save();
    ctx.body = { data: ctx.state.mealType };
  }
);

module.exports = router;
