const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BaseDataSchema = new Schema({
  advertesPicture: Object,
  floor1: Array,
  floor2: Array,
  floor3: Array,
  floorName: Object,
  category: Array,
  slides: Array,
  hotGoods: Array,
  recommend: Array,
  buyTime: String,
  sendFee: Object
},
{
  collection: 'baseData'
})

mongoose.model('baseData', BaseDataSchema)
