const { omit } = require('lodash');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const schema = new mongoose.Schema(
  {
    userId:      { type: ObjectId,ref: 'User'},
    doctor_id:   { type: ObjectId,ref: 'User'},
    diabetesType:{ type: ObjectId,ref: 'diabetesType'},
    deletedAt:   { type:Date}
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

module.exports = mongoose.models.userMedical || mongoose.model('userMedical', schema);









