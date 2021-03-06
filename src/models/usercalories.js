const { omit } = require('lodash');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;
require('./user');
require('./diettype');
const schema = new mongoose.Schema(
  {
    userId:      {type: ObjectId, ref: 'User'},
    calcCalories:{type:String,required:true,},
    dietType:    {type: ObjectId,ref: 'dietType'},
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

module.exports = mongoose.models.userCalories || mongoose.model('userCalories', schema);









