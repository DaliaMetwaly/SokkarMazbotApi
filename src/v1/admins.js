const Router = require('koa-router');
// const Joi = require('joi');
// const validate = require('../middlewares/validate');
const authenticate = require('../middlewares/authenticate');
const User = require('../models/user');
// const   Country=require('../models/country');
// const   UserRole=require('../models/userrole');
// const   City=require('../models/city');
const router = new Router();

const fetchAllAdmins = async (ctx, next) => {
    ctx.state.alluser =  await User.find( { role:  {$ne: '5e2949c7c3557f6ec545a5de'} } ).populate("country",'title').populate("role",'title').populate("city",'title');
    if (!ctx.state.alluser) ctx.throw(500, "can't get all users ");
    await next();
};

const deleteAdmin = async (ctx, next) => {
    const  id = ctx.request.body;

    ctx.state.deleteduser =  await User.findByIdAndRemove(id.Id);
    if (!ctx.state.deleteduser) ctx.throw(500, "can't delete this user ");
    await next();
};
router
    .use(authenticate({ type: 'user' }))
    .use(fetchAllAdmins)
    .get('/all', (ctx) => {
        ctx.body = { data: ctx.state.alluser };
    })
    .patch(
        '/all',
        async (ctx) => {
            const { user } = ctx.state;
            Object.assign(user, ctx.request.body);
            // await user.save();
            ctx.body = { data: user };
        }
    );

router
    .use(authenticate({ type: 'user' }))
    .use(deleteAdmin)
    .delete('/deleteAdmin', (ctx) => {
        ctx.body = { data:  ctx.state.deleteduser };
    })
    .patch(
        '/deleteAdmin',
        async (ctx) => {
            const { user } = ctx.state;
            Object.assign(user, ctx.request.body);
            // await user.save();
            ctx.body = { data: user };
        }
    );



module.exports = router;
