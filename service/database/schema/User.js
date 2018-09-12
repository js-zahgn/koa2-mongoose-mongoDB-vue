const mongoose = require('mongoose')
const Schema = mongoose.Schema
const {ObjectId} = Schema.Types
const bcrypt = require('bcrypt-nodejs')
const SALT_WORK_FACTOR = 10

// // 创建用户Schema
const userSchema = new Schema({
  UserId: ObjectId,
  userName: {unique: true, type: String},
  password: String,
  master: Boolean,
  userImg: String,
  createAt: {type: Date, default: Date.now()},
  lastLoginAt: {type: Date, default: Date.now()}
},
{
  collection: 'user'
})

userSchema.pre('save', function(next) {
  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if(err) return next(err)
    bcrypt.hash(this.password, salt, null, (err, hash) => {
      if(err) return next(err)
      this.password = hash
      next()
    })
  })
})

userSchema.methods = {
  comparePassword: (reqPWD, dbPWD) => {
    return new Promise((resolve, reject) => {
      bcrypt.compare(reqPWD, dbPWD, (err, isMatch) => {
        if(!err) resolve(isMatch)
        else reject(err)
      })
    })
  }
}

// 发布模型
mongoose.model('User', userSchema)
