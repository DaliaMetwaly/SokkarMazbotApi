const { omit } = require('lodash');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;
require('./articlecategory')

const schema = new mongoose.Schema(
  {

  title:             {type:String,required:true},
  author:            {type:String},
  images:            {type:String},
  shortDescription:  {type:String},
  description:       {type:String},
  category:          {type: ObjectId,ref: 'articleCategory'},
  deletedAt:         {type:Date}

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

module.exports = mongoose.models.articleCategory || mongoose.model('articleCategory', schema);









