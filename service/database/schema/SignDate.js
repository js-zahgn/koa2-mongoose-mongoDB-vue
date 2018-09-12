const mongoose = require('mongoose')
const Schema = mongoose.Schema

const signSchema = new Schema({
  userName: String,
  signCount: Number,
  signDate: []
}, {
  collection: 'sign'
})

mongoose.model('Sign', signSchema)
