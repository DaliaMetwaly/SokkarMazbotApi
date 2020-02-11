const { omit } = require('lodash');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;
require('./user');
const schema = new mongoose.Schema(
  {
    userId:         {type:ObjectId, ref: 'User'},
    image:          {type:String,required:true },
    specialization: {type:String,required:true,},
    description:    {type:String,required:true,},
    deletedAt:      {type:Date}
  },
  {
    timestamps: true
  }
);

schema.methods.delete = function deleteFn() {
  this.deletedAt = new Date();
  return this.save();
};

schema.methods.toResource = function toResource() {
  return {
    id: this._id,
    ...omit(this.toObject(), ['_id', '__v'])
  };
};

module.exports = mongoose.models.userDoctorInfo || mongoose.model('userDoctorInfo', schema);









