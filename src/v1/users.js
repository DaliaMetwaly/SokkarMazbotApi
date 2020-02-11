const Router = require('koa-router');
const Joi = require('joi');
const validate = require('../middlewares/validate');
const authenticate = require('../middlewares/authenticate');
const User = require('../models/user');
const   Country=require('../models/country');
const   UserRole=require('../models/userrole');
const   City=require('../models/city');
const   ActivityRate=require('../models/activityrate');
const  SokerType =require('../models/diabetestype');
const  DietType =require('../models/diettype');


const upload = require('../middlewares/uploadMiddleware');
const Resize = require('../middlewares/Resize');
const path = require('path');
const router = new Router();



const passwordField = Joi.string()
    .min(6)
    .options({
        language: {
            string: {
                regex: {
                    base: 'Your password must be at least 6 characters long. Please try another.'
                }
            }
        }
    });
const fetchUser = async (ctx, next) => {
  ctx.state.user = await User.findById(ctx.state.jwt.userId);
  if (!ctx.state.user) ctx.throw(500, 'user associsated to token could not not be found');
  await next();
};
const fetchAllUser = async (ctx, next) => {
    ctx.state.alluser =  await User.find( { role:  '5e2949c7c3557f6ec545a5de'  } ).populate("country",'title').populate("role",'title').populate("city",'title').populate("dietType",'title').populate("userActivity",'title');
    if (!ctx.state.alluser) ctx.throw(500, "can't get all users ");
    await next();
};
const fetchAllDataForUser = async (ctx, next) => {
    ctx.state.allCountry =  await Country.find({});
    ctx.state.allCity =  await City.find({});
    ctx.state.allDoctor =  await User.find( { role:'5e294a000055296f22313134'});
    ctx.state.allActivityRate =  await ActivityRate.find({});
    ctx.state.allSokerType =  await SokerType.find({});
    ctx.state.allDietType =  await DietType.find({});
    if (! ctx.state.allCountry ||   !ctx.state.allCity||! ctx.state.allDoctor ||   !ctx.state.allActivityRate||   !ctx.state.allSokerType || !    ctx.state.allDietType) ctx.throw(500, "can't get all data ");
    await next();
};

const fetchAllDataForEditUser = async (ctx, next) => {

    const  id = ctx.request.body;
    ctx.state.allCountry =  await Country.find({});
    ctx.state.allCity =  await City.find({});
    ctx.state.allDoctor =  await User.find( { role:'5e294a000055296f22313134'});
    ctx.state.allActivityRate =  await ActivityRate.find({});
    ctx.state.allSokerType =  await SokerType.find({});
    ctx.state.allDietType =  await DietType.find({});
    ctx.state.editUserInfo =await User.find( { _id:  id.Id  } ).populate("country").populate("sokerType").populate("city").populate("dietType").populate("userActivity").populate("doctorId");
    if (! ctx.state.allCountry ||   !ctx.state.allCity||! ctx.state.allDoctor ||   !ctx.state.allActivityRate||   !ctx.state.allSokerType || !    ctx.state.allDietType || !    ctx.state.editUserInfo ) ctx.throw(500, "can't get all data ");
    await next();
};
const updateUserInfo = async (ctx, next) => {
    console.log(ctx.state);
    // ctx.state.user = await User.findById(ctx.state.jwt.userId);
    // if (!ctx.state.user) ctx.throw(500, 'user associsated to token could not not be found');
    // await next();
};
const deleteUser = async (ctx, next) => {
    const  id = ctx.request.body;

    ctx.state.deleteduser =  await User.findByIdAndRemove(id.Id);
    if (!ctx.state.deleteduser) ctx.throw(500, "can't delete this user ");
    await next();
};

router
  .use(authenticate({ type: 'user' }))
  .use(fetchUser)
  .get('/me', (ctx) => {
    ctx.body = { data: ctx.state.user.toResource() };
  })
  .patch(
    '/me',
    validate({
      body: {
        name: Joi.string().required()
      }
    }),
    async (ctx) => {
      const { user } = ctx.state;
      Object.assign(user, ctx.request.body);
      await user.save();
      ctx.body = { data: user.toResource() };
    }
  );



router
    .use(authenticate({ type: 'user' }))
    .use(fetchAllUser)
    .get('/all', (ctx) => {
        ctx.body = { data: ctx.state.alluser };
    })  .patch(
    '/all',

    async (ctx) => {
        const { user } = ctx.state;
        Object.assign(user, ctx.request.body);

        ctx.body = { data: user.toResource() };
    }
);
router
    .use(authenticate({ type: 'user' }))
    .use(fetchAllDataForUser)
    .get('/allUserInfo', (ctx) => {
        ctx.body = { Country: ctx.state.allCountry ,City: ctx.state.allCity ,Doctor: ctx.state.allDoctor ,ActivityRate: ctx.state.allActivityRate ,SokerType: ctx.state.allSokerType , DietType:   ctx.state.allDietType};
    })  ;
router
    .use(authenticate({ type: 'user' }))
    .post(
        '/addUser',
        validate({
            body: {
                first_name: Joi.string().required(),
                last_name: Joi.string().required(),
                email: Joi.string()
                    .lowercase()
                    .email()
                    .required(),

                password: passwordField.required(),
                phone:Joi.string().required(),
                gender:Joi.string().required(),
                birth_day:Joi.string().required(),
                country:Joi.string().required(),
                city:Joi.string().required(),
                length:Joi.string().required(),
                weight:Joi.string().required(),
                doctor_id:Joi.string().required(),
                user_activity:Joi.string().required(),
                soker_type:Joi.string().required(),
                medical_name:Joi.string().required(),
                diet_type:Joi.string().required(),
            }
        }),
        async (ctx) => {
            console.log(ctx);
            const {first_name,last_name, email,password, phone,gender,birth_day,country,city,length,weight,doctor_id,user_activity,soker_type,medical_name,diet_type} = ctx.request.body;
console.log({first_name,last_name, email,password, phone,gender,birth_day,country,city,length,weight,doctor_id,user_activity,soker_type,medical_name,diet_type});
            const existingUser = await User.findOne({ email, deletedAt: { $exists: false } });
            if (existingUser) {
                ctx.throw(400, 'A user with that email already exists');
            }

            const user = await User.create({
                firstName: first_name,
                lastName: last_name,
                email: email,
                password: password,
                gender: gender,
                phone: phone,
                country: country,
                city: city,
                length: length,
                weight: weight,
                doctorId: doctor_id,
                sokerType: soker_type,
                birthDate:birth_day,
                userActivity: user_activity,
                medicalName:medical_name,
                dietType:diet_type,
                role:"5e2949c7c3557f6ec545a5de",
            });
            // const imagePath = path.join(__dirname, '/upload/profileImage');
            // const fileUpload = new Resize(imagePath);
            // if (!req.file) {
            //     res.status(401).json({error: 'Please provide an image'});
            // }
            // const filename = await fileUpload.save(req.file.buffer);
            // return res.status(200).json({ name: filename });
            // await sendWelcome({
            //     firstName,
            //     to: email
            // });

            ctx.body = { data: { msg: "تم اضافة المريض بنجاح" } };
        }
    );
    
router
    .use(authenticate({ type: 'user' }))
    .use(fetchAllDataForEditUser)
    .post('/editUserInfo',
        (ctx) => {
        ctx.body = { Country: ctx.state.allCountry ,City: ctx.state.allCity ,Doctor: ctx.state.allDoctor ,ActivityRate: ctx.state.allActivityRate ,SokerType: ctx.state.allSokerType , DietType:   ctx.state.allDietType,  UserInfo : ctx.state.editUserInfo };
    })  ;


    
router
    .use(authenticate({ type: 'user' }))
    .use(updateUserInfo)
    .post('/editUser',
        (ctx) => {
        ctx.body = { Country: ctx.state.allCountry ,City: ctx.state.allCity ,Doctor: ctx.state.allDoctor ,ActivityRate: ctx.state.allActivityRate ,SokerType: ctx.state.allSokerType , DietType:   ctx.state.allDietType,  UserInfo : ctx.state.editUserInfo };
    })  ;
router
    .use(authenticate({ type: 'user' }))
    .use(deleteUser)
    .delete('/deleteUser', (ctx) => {
        ctx.body = { data:  ctx.state.deleteduser };
    })  .patch(
    '/deleteUser',

    async (ctx) => {
        const { user } = ctx.state;
        Object.assign(user, ctx.request.body);

        ctx.body = { data: user.toResource() };
    }
);



module.exports = router;
