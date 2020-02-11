const { omit } = require('lodash');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;
require('./category');
const schema = new mongoose.Schema(
  {
  title:       {type:String,required:true,},
  unitType:    {type:String,},
  quantity:    {type:Number,},
  calories:    {type:Number,},
  carbohydrate:{type:Number,},
  protein:     {type:Number,},
  fats:        {type:Number,},
  category:    {type: ObjectId,ref: 'Category'},
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

module.exports = mongoose.models.Ingredient || mongoose.model('Ingredient', schema);









