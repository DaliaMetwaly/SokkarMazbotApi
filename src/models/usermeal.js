const { omit } = require('lodash');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const schema = new mongoose.Schema(
  {
    userId:     {type: ObjectId, ref: 'User'},
    title:      {type:String,required:true,},
    description:{type:String,},
    mealDate:   {type:Date,},
    deletedAt:  {type:Date}
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

module.exports = mongoose.models.userMeal || mongoose.model('userMeal', schema);









