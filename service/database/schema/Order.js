const mongoose = require('mongoose')
const Schema = mongoose.Schema
const {ObjectId} = Schema.Types

const orderSchema = new Schema({
  userName: String,
  Id: ObjectId,
  address: String,
  orderNO: Number,
  status: Number,
  payType: Number,
  goods: [{
    Count: Number,
    Id: String,
    Image: String,
    Name: String,
    Price: Number,
    OriPrice: Number
  }],
  total: Number,
  createTime: {type: Date, default: Date.now()},
  closeTime: Date
},
{
  collection: 'order'
})

mongoose.model('Order', orderSchema)
