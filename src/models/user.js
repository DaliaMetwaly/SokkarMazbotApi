const { omit } = require('lodash');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('./userrole');
require('./city');
require('./country');

const { ObjectId } = mongoose.Schema.Types;

const schema = new mongoose.Schema(
  {

  firstName: {type:String},
  lastName:  {type:String},
  email:     {type: String,unique:true,required: true,lowercase: true,trim: true},
  password:  {type:String},
  gender:    {type:String},
  phone:     {type:String},
  image:     {type:String},
  birthDate: {type:Date},
  country:   {type: mongoose.SchemaTypes.ObjectId, index: true, ref: 'Country'},
  city:      {type: mongoose.SchemaTypes.ObjectId, index: true, ref: 'City'},
  length: {type:String},
  weight: {type:String},
  userActivity: {type: mongoose.SchemaTypes.ObjectId, index: true, ref: 'activityRate'},
  sokerType: {type: mongoose.SchemaTypes.ObjectId, index: true, ref: 'diabetesType'},
  medicalName: {type:String},
  medicalImage:{type:String},
  doctorId:{type: mongoose.SchemaTypes.ObjectId, index: true, ref: 'User'},
  dietType:{type: mongoose.SchemaTypes.ObjectId, index: true, ref: 'dietType'},
  infoSeen:  {type:Number},
  //isAdmin:   {type: Number,},
  role: {type: ObjectId, index: true, ref: 'userRole'},
  deletedAt: { type: Date },

  },
  {
    timestamps: true
  }
);

schema.methods.isAdmin = function isAdmin() {
  return this.role.indexOf('admin') !== -1;
};

schema.methods.hasRole = function hasRole(role = 'user') {
  return this.role.indexOf(role) !== -1;
};

schema.methods.verifyPassword =async function verifyPassword(password) {
    var hashed= await  bcrypt.hash(password, 10)
    var result=await bcrypt.compare(password, hashed);
    return result;
  
};

schema.methods.assign = function assign(fields) {
  Object.assign(this, omit(fields, ['createdAt', 'updatedAt', 'deletedAt', 'id', 'password'], {}));
};

schema.methods.delete = function deleteFn() {
  this.deletedAt = new Date();
  return this.save();
};

// schema.virtual('password').set(function setPassword(password) {
//   this._password = password;
// });

schema.pre('save', async function preSave(next) {
  if (this._password) {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this._password, salt);
    delete this._password;
  }
  return next();
});

schema.methods.toResource = function toResource() {
  return {
    id: this._id,
    ...omit(this.toObject(), ['_id', '__v', 'password', '_password'])
  };
};

module.exports = mongoose.models.User || mongoose.model('User', schema);