const mongoose = require('mongoose')
const Schema = mongoose.Schema
const {ObjectId} = Schema.Types

const addressSchema = new Schema({
  uName: {type: String, ref: 'user'},
  userName: String,
  ID: ObjectId,
  user: String,
  mobileNO: Number,
  province: {name: String, code: String},
  city: {name: String, code: String},
  county: {name: String, code: String},
  detail: String,
  isDefault: Boolean,
  createTime: {type: Date, default: new Date().getTime()}
},
{
  collection: "address"
})

mongoose.model('Address', addressSchema)
