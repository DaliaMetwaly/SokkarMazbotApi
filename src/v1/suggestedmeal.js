const Router = require('koa-router');
const Joi = require('joi');
const validate = require('../middlewares/validate');
const suggestedmealModel = require('../models/suggestedmeal');
const authenticate = require('../middlewares/authenticate');
const router = new Router();

router.post(
  '/add',
  validate({
    body: {
        title:         Joi.string().required(),
        description:   Joi.string().required(),
        calories:      Joi.number().required(),
        carbohydrate:  Joi.number().required(),
        protein:       Joi.number().required(),
        fats:          Joi.number().required(),
        duration:      Joi.number().required(),
        type:          Joi.string().required(),
        isApproved:    Joi.boolean().optional(),
        isActive:      Joi.boolean().optional(),
    }
  }),
  authenticate({ type: 'user' }),
  async (ctx) => {     
    const suggestedMeal = await suggestedmealModel.create({
      ...ctx.request.body,
    });

    ctx.body = { data: suggestedMeal  };
  }
).post(
  '/delete',
  authenticate({ type: 'user' }),
  async (ctx) => {     
    const  id = ctx.request.body;
    ctx.state.deletedSuggestedMeal =  await suggestedmealModel.findByIdAndRemove(id.Id);
    if (!ctx.state.deletedSuggestedMeal) ctx.throw(500, "can't delete this suggested meal  ");
    ctx.body = { data:  ctx.state.deletedSuggestedMeal };
  }
).get(
  '/all',
  authenticate({ type: 'user' }),
  async (ctx) => {     
    ctx.state.allSuggestedMeal =  await suggestedmealModel.find({}).populate('type');
    if (!ctx.state.allSuggestedMeal) ctx.throw(500, "can't get all Suggested Meal ");
    ctx.body = { data: ctx.state.allSuggestedMeal };
  }
).get(
  '/getinfo',
  authenticate({ type: 'user' }),
  async (ctx) => {     
    const  id = ctx.request.query.id
    ctx.state.suggestedMeal =await suggestedmealModel.find({_id:id});
    if (!ctx.state.suggestedMeal) ctx.throw(500, "can't get suggested meal info ");
    ctx.body = { data: ctx.state.suggestedMeal};
  }
).post(
  '/update',
  authenticate({ type: 'user' }),
  async (ctx) => {     
    const  {id,title,description,calories,carbohydrate,protein,fats,duration,type,isApproved,isActive} =ctx.request.body;
    ctx.state.suggestedMeal = await suggestedmealModel.findById(id);
    if (!ctx.state.suggestedMeal) ctx.throw(500, 'Meal type associsated to token could not not be found');
    ctx.state.suggestedMeal.title = title;
    ctx.state.suggestedMeal.description = description;
    ctx.state.suggestedMeal.calories = calories;
    ctx.state.suggestedMeal.carbohydrate = carbohydrate;
    ctx.state.suggestedMeal.protein = protein;
    ctx.state.suggestedMeal.fats = fats;
    ctx.state.suggestedMeal.duration = duration;
    ctx.state.suggestedMeal.type = type;
    ctx.state.suggestedMeal.isApproved = isApproved;
    ctx.state.suggestedMeal.isActive = isActive;

    await ctx.state.suggestedMeal.save();
    ctx.body = { data: ctx.state.suggestedMeal };
  }
);

module.exports = router;
