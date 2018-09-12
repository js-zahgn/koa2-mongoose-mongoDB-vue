const mongoose = require('mongoose');
const { Schema } = mongoose;
const {ObjectId} = Schema.Types

const cartSchema = new Schema({
  CartId: ObjectId,
  userName: {unique: true, type: String},
  goodsList: [{
    Count: Number,
    Id: String,
    Image: String,
    Name: String,
    Price: Number,
    OriPrice: Number
  }]
},
{
  collection: 'shoppingCart'
})

mongoose.model('Cart', cartSchema)
