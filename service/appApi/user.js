const Router = require('koa-router')
const mongoose = require('mongoose')
const svgCaptcha = require('svg-captcha')
let router = new Router()
const bcrypt = require('bcrypt-nodejs')
const fs = require('fs')
const SALT_WORK_FACTOR = 10

const createToken = require('../token/createToken.js');

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
    const date = new Date()
    ctx.cookies.set('CheckCode', cap.text.toLowerCase(), {
      // domain: '127.0.0.1',
      // path: '/register',
      maxAge: 300000,
      expires: new Date(`${date.getFullYear()}-12-31`),
      httpOnly: false,
      overwrite: false
    })
    ctx.status = 500
    ctx.body = { data: cap.data }
  } catch (err) {
    ctx.status = 500
    ctx.body = { data: `获取验证码失败-->${err}` }
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
    if (CheckCode != body.code) {
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
          await User.updateOne({ userName: name }, set).exec().then(() => {
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
    } else {
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
    await User.findOne({ userName: name }).exec().then(res => {
      ctx.status = 200
      ctx.body = {
        data: {
          userName: res.userName,
          userImg: res.userImg
        }
      }
    })
  } catch (err) {
    ctx.status = 401
    ctx.body = { data: '获取用户信息失败-->' + err }
  }
})

// 上传用户头像
router.post('/uploadUserImg', async(ctx) => {
  try {
    const { img, name } = ctx.request.body;
    const { username } = ctx.request.headers
    const dd = new Date()
    const dateNow = dd.getTime().toString(16)
    const diskUrl = `F:/n_files/images/${username}`
    const targetUrl = `${diskUrl}/${dateNow}_${name}`
    // 如果文件夹不存在就新建此文件夹
    if (!fs.existsSync(diskUrl)) {
      fs.mkdirSync(diskUrl, err => {
        if (err) {
          ctx.status = 500
          ctx.body = { data: '上传头像失败-->' + err }
        }
      })
    }
    const nginxHost = 'http://127.0.0.1:2020/images'
    const User = mongoose.model('User')
    const set = { $set: { userImg: `${nginxHost}/${username}/${dateNow}_${name}` } }
    await User.updateOne({ userName: username }, set).exec().then(async() => {
      const dataBuffer = Buffer.from(img.replace(/^data:image\/\w+;base64,/, ''), 'base64')
      await new Promise(resolve => {
        fs.writeFile(targetUrl, dataBuffer, (err) => {
          if (err) {
            ctx.status = 500
            ctx.body = { data: '上传头像失败-->' + err }
          }
        })
        resolve()
      })
      ctx.status = 200
      ctx.body = {
        data: {
          userName: username,
          userImg: set.$set.userImg
        }
      }
    })
  } catch (err) {
    ctx.status = 500
    ctx.body = { data: '上传头像失败-->' + err }
  }
})

// 用过的头像
router.get('/getUsedUserImg/:name', async(ctx) => {
  try {
    let imgArr = []
    const diskUrl = `F:/n_files/images/${ctx.params.name}`
    const nginxHost = `http://127.0.0.1:2020/images/${ctx.params.name}`
    await new Promise(resolve => {
      fs.readdir(diskUrl, (err, file) => {
        if (err) {
          ctx.status = 500
          ctx.body = { data: '读取文件失败->' + err }
        }
        imgArr = file
        resolve()
      })
    })

    ctx.status = 200
    ctx.body = imgArr.map(img => `<img src="${nginxHost}/${img}" width="100px"/>`).join(',')
  } catch (err) {
    ctx.status = 500
    ctx.body = {data: '获取头像失败-->' + err}
  }
})

module.exports = router
