const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TestSchema = new Schema({
  // name: String,
  // age: Number,
  // sex: Boolean,
  // job: String,
  // skill: {
  //   skillOne: String,
  //   skillTwo: String,
  //   skillThree: String
  // },
  // interested: Array,
  // registerTime: {type: Date, default: new Date()}
  createTime: Date,
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
  randNum9: Number,
},
{
  collection: "testData"
})

const TestSchema2 = new Schema({
  name: String,
  age: Number,
  sex: Boolean,
  job: String,
  skill: {
    skillOne: String,
    skillTwo: String,
    skillThree: String
  },
  interested: Array,
  registerTime: {type: Date, default: new Date()}
},
{
  collection: "testData2"
})

mongoose.model('testData', TestSchema)
mongoose.model('testData2', TestSchema2)
