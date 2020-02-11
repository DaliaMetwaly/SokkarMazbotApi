const { omit } = require('lodash');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;
require('./user');
require('./activityrate');
const schema = new mongoose.Schema(
  {
    userId:      {type: ObjectId, ref: 'User'},
    length:      {type:String,required:true,},
    weight:      {type:String,required:true,},
    activityRate:{type:ObjectId,ref: 'activityRate'},
    deletedAt:   {type:Date}
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

module.exports = mongoose.models.userInfo || mongoose.model('userInfo', schema);









