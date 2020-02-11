const Router = require('koa-router');
const Joi = require('joi');
const validate = require('../middlewares/validate');
const categoryModel = require('../models/category');
const authenticate = require('../middlewares/authenticate');
const router = new Router();

router.post(
  '/add',
  validate({
    body: {
        title:            Joi.string().required(),
        image:            Joi.any().meta({swaggerType: 'file'}).required().allow('').description('image file'),
        shortDescription: Joi.string().required(),
    }
  }),
  authenticate({ type: 'user' }),
  async (ctx) => {     
    const category = await categoryModel.create({
      ...ctx.request.body,
    });

    ctx.body = { data: {category:category } };
  }
).post(
  '/delete',
  authenticate({ type: 'user' }),
  async (ctx) => {     
    ctx.state.deletedCategory =  await categoryModel.findByIdAndRemove(ctx.request.body.Id);
    if (!ctx.state.deletedCategory) ctx.throw(500, "can't delete this category ");
    ctx.body = { data:  ctx.state.deletedCategory };
  }
).get(
  '/all',
  authenticate({ type: 'user' }),
  async (ctx) => {     
    ctx.state.allCategories =  await categoryModel.find({});
    if (!ctx.state.allCategories) ctx.throw(500, "can't get all Categories ");
    ctx.body = { data: ctx.state.allCategories };
  }
).get(
  '/getinfo',
  authenticate({ type: 'user' }),
  async (ctx) => {     
    const  id = ctx.request.query.id
    ctx.state.category =await categoryModel.find({_id:id});
    if (!ctx.state.category) ctx.throw(500, "can't get category info ");
    ctx.body = { data: ctx.state.category};
  }
).post(
  '/update',
  authenticate({ type: 'user' }),
  async (ctx) => {     
    const  {id,title,image,shortDescription} =ctx.request.body;
    ctx.state.category = await categoryModel.findById(id);
    if (!ctx.state.category) ctx.throw(500, 'Category associsated to token could not not be found');
    ctx.state.category.title = title;
    ctx.state.category.image = image;
    ctx.state.category.shortDescription = shortDescription;
    await ctx.state.category.save();
    ctx.body = { data: ctx.state.category };
  }
);

module.exports = router;
