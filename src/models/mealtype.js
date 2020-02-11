const { omit } = require('lodash');
const mongoose = require('mongoose');
mongoose.set('debug', true);
const schema = new mongoose.Schema(
  {
    title     :{type:String,required:true},
    percentage:{type:String,required:true},
    deletedAt :{type:Date}
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

module.exports = mongoose.models.mealType || mongoose.model('mealType', schema);
// module.exports =mongoose.model("mealType", schema, "mealType")









