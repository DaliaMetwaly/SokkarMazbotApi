const Router = require('koa-router');
const auth = require('./auth');
const users = require('./users');
const admins = require('./admins');
const countries = require('./country');
const mealType = require('./mealtype');
const category = require('./category');
const suggestedmeal = require('./suggestedmeal');


const router = new Router();

router.use('/auth', auth.routes());
router.use('/users', users.routes());
router.use('/admins', admins.routes());
router.use('/country', countries.routes());
router.use('/mealtype', mealType.routes());
router.use('/category', category.routes());
router.use('/suggestedmeal', suggestedmeal.routes());

module.exports = router;
