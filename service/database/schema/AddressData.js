const mongoose = require('mongoose')
const Schema = mongoose.Schema

const addressDataSchema = new Schema({
  ID: Number,
  province_list: Object,
  city_list: Object,
  county_list: Object
},
{
  collection: "addressData"
})

mongoose.model('addressData', addressDataSchema)
