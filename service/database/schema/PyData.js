const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PySchema = new Schema({
  createTime: String,
  username: String,
  randNum0: Number,
  randNum1: Number,
  randNum2: Number,
  randNum3: Number,
  randNum4: Number,
  randNum5: Number,
  randNum6: Number,
  randNum7: Number,
  randNum8: Number,
  randNum9: Number
},
{collection: 'pyTestData'}
)

mongoose.model('pyTestData', PySchema)
