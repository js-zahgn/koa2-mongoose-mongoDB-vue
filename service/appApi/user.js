const Router = require('koa-router')
const mongoose = require('mongoose')
const md5 = require('js-md5')
const svgCaptcha = require('svg-captcha')
let router = new Router()
const bcrypt = require('bcrypt-nodejs')
const SALT_WORK_FACTOR = 10

const createToken = require('../token/createToken.js');
// const checkToken = require('../token/checkToken.js');

// 获取验证码
router.get('/getVerificationCode', async(ctx) => {
  try {
    const codeConfig = {
      size: 4,
      ignoreChars: '0o1i',
      noise: 1,
      width: 120,
      height: 44,
      color: true,
      // background: '#cc9966'
    }
    const cap = svgCaptcha.create(codeConfig)

    ctx.cookies.set('CheckCode', cap.text.toLowerCase(), {
      // domain: '127.0.0.1',
      // path: '/register',
      maxAge: 300000,
      expires: new Date('2018-12-31'),
      httpOnly: false,
      overwrite: false
    })
    ctx.status = 200
    ctx.body = {
      data: cap.data
    }
  } catch (err) {
    ctx.status = 500;
    ctx.body = {
      data: `获取验证码失败-->${err}`
    }
  }
})

// 用户注册
router.post('/register', async(ctx) => {
  const CheckCode = ctx.cookies.get('CheckCode')
  if(CheckCode) {
    // 获取Model
    const User = mongoose.model('User')
    // 接收前端传输的数据，并封装成新的user对象
    const {body} = ctx.request;
    if(CheckCode != body.code) {
      ctx.status = 500
      ctx.body = {data: '验证码错误，请输入正确验证码'}
      return
    }
    const token = createToken(body.name)
    let newUser = new User(Object.assign(body, {token: token, userImg: null}))
    await User.findOne({userName: body.name}).exec().then(async(res) => {
      if (res) {
        ctx.status = 500
        ctx.body = {data: '该用户名已被注册'}
      } else {
        // 用mongoose的save方法直接存储，返回相应的状态结果
        await newUser.save().then(() => {
          ctx.status = 200
          ctx.body = {data: '注册成功'}
        }).catch(err => {
          ctx.status = 500
          ctx.body = { data: '注册失败-->' + err }
        })
      }
    }).catch(err => {
      ctx.status = 500
      ctx.body = {data: '注册失败-->' + err}
    })
  } else {
    ctx.status = 408
    ctx.body = {data: '验证码过期，请重新获取'}
  }
})

// 修改密码
router.post('/changePassword', async(ctx) => {
  try{
    const User = mongoose.model('User');
    const query = {userName: ctx.request.body.name}
    const salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
    const hash = bcrypt.hashSync(ctx.request.body.newPwd, salt);
    const set = {$set: {password: hash}}
    await User.updateOne(query, set).exec().then(res => {
      ctx.status = 200
      ctx.body = { data: '修改成功' }
    }).catch(err => {
      ctx.status = 500
      ctx.body = { data: '修改失败-->' + err }
    })
  } catch (err) {
    ctx.status = 500
    ctx.body = {data: '修改失败-->' + err}
  }
})

// 用户登录
router.post('/login', async(ctx) => {
  // 获取前端数据
  const {body} = ctx.request
  const {name, password} = body

  // 获取User的model
  const User = mongoose.model('User')
  // 查找用户是否存在，并对比密码
  await User.find({userName: name}).exec().then(async(res) => {
    if(res) {
      // 当用户名存在时，对比密码
      const newUser = new User()
      await newUser.comparePassword(password, res[0].password).then(async(isMatch) => {
        if(isMatch) {
          const token = createToken(name)
          const set = {$set: {lastLoginAt: new Date().getTime(), token: token}}
          await User.updateOne({userName: name}, set).exec().then(() => {
            ctx.status = 200
            ctx.body = {data: isMatch, token: token}
          })
        } else {
          ctx.status = 200
          ctx.body = {data: isMatch}
        }
        // 返回匹配结果
      }).catch(err => {
        ctx.status = 500
        ctx.body = {data: err}
      })
    }else{
      ctx.status = 500
      ctx.body = {data: '用户名不存在'}
    }
  }).catch(err => {
    ctx.status = 500
    ctx.body = {data: err}
  })
})

// 获取用户信息
router.get('/getUserInfo', async(ctx) => {
  try {
    const User = mongoose.model('User')
    const name = ctx.request.header.username;
    await User.findOne({userName: name}).exec().then(res => {
      ctx.status = 200
      ctx.body = {
        data: {
          userName: res.userName,
          userImg: res.userImg
        }
      }
    })
  } catch(err) {
    ctx.status = 401
    ctx.body = {
      data: '获取用户信息失败-->' + err
    }
  }
})

// 上传用户头像
router.post('/uploadUserImg', async(ctx) => {
  try {
    const User = mongoose.model('User')
    const {img} = ctx.request.body
    const name = ctx.request.headers.username
    const set = {$set: {userImg: img}}
    await User.updateOne({userName: name}, set).exec().then(() => {
      ctx.status = 200
      ctx.body = {
        data: {
          userName: name,
          userImg: img
        }
      }
    })
  } catch (err) {
    ctx.status = 500
    ctx.body = {
      data: '上传头像失败-->' + err
    }
  }
})

// 前端登录md5加密防止恶意截取密码，将数据库中密码进行md5加密同前端传的md5密码进行对比
// 后端存盐加密防止数据库被破解，将存入数据库的密码进行salt加密
// 貌似前端加密和后端加密不能同时共存

module.exports = router
