const { omit } = require('lodash');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;
require('./mealtype');
const schema = new mongoose.Schema(
  {

  title:        {type:String,required:true},
  description:  {type:String,},
  calories:     {type:Number,},
  carbohydrate: {type:Number,},
  protein:      {type:Number,},
  fats:         {type:Number,},
  duration:     {type:Number,},
  type:         {type: ObjectId,ref: 'mealType'},
  isApproved:   {type:Boolean,default: false},
  isActive:     {type:Boolean,default: false},
  deletedAt:    {type:Date}

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

module.exports = mongoose.models.suggestedMeal || mongoose.model('suggestedMeal', schema);









