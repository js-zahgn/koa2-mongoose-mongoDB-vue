const mongoose = require('mongoose');
const Router = require('koa-router');
let router = new Router()

const checkToken = require('../token/checkToken.js');
const createToken = require('../token/createToken.js');
// 获取日期00:00:00点时间戳
const getMoment = (d) => {
  const dd = new Date(d)
  return new Date(dd.getFullYear(), dd.getMonth(), dd.getDate(), 0, 0, 0).getTime()
}
// 获取用户签到信息
router.get('/getUserSignInfo', checkToken, async(ctx) => {
  try{
    const SignIn = mongoose.model('Sign')
    const name = ctx.request.header.username;
    const query = {userName: name}
    const res = await SignIn.findOne(query);
    if(res) {
      const lastD = getMoment(res.signDate[0])
      const nowD = getMoment(new Date().getTime())
      if(nowD - lastD > 24 * 60 * 60 * 1000) {
        const set = {$set: {signDate: [], signCount: 0}}
        await SignIn.findOneAndUpdate(query, set).exec().then(() => {
          ctx.status = 200
          ctx.body = {
            data: {
              signCount: 0,
              signDate: []
            }
          }
        })
      } else {
        ctx.status = 200
        ctx.body = {
          data: res
        }
      }
    } else {
      ctx.status = 200
      ctx.body = {
        data: {
          signCount: 0,
          signDate: []
        }
      }
    }
  } catch(err) {
    ctx.status = 500
    ctx.body = {
      data: err + '---出错了'
    }
  }
})

// 点击签到
router.post('/signInAction', async(ctx) => {
  try{
    const SignIn = mongoose.model('Sign')
    const name = ctx.request.header.username;
    const {date} = ctx.request.body;
    await SignIn.findOne({userName: name}).exec().then(async(res) => {
      if(res) { // 当数据库中有此用户签到信息时
        const lastD = getMoment(res.signDate[0])
        const nowD = getMoment(date)
        if (nowD == lastD) { // 同一天
          ctx.status = 500
          ctx.body = {data: '同一天只能签到一次'}
        } else {
          let newDateList = [date].concat(res.signDate)
          if(newDateList.length > 10) newDateList = newDateList.slice(0, 10);
          const isContinue = nowD - lastD == 24 * 60 * 60 * 1000
          let set = {$set: {signDate: newDateList, signCount: isContinue ? res.signCount + 1 : 1}}
          await SignIn.updateOne({userName: name}, set).exec().then(() => {
            ctx.status = 200
            ctx.body = {data: set.$set}
          }).catch(err => {
            ctx.status = 500
            ctx.body = {data: '签到失败-->' + err}
          })
        }
      } else {
        let newSign = new SignIn({
          userName: name,
          signCount: 1,
          signDate: [date],
          token: createToken(name)
        })
        await newSign.save().then(() => {
          ctx.status = 200
          ctx.body = {data: {signCount: 1, signDate: [date]}}
        })
      }
    })
  }catch(err) {
    ctx.status = 500
    ctx.body = {
      data: err + '---出错了'
    }
  }
})

// 重置签到信息
router.post('/clearSignInfo', async(ctx) => {
  try{
    const SignIn = mongoose.model('Sign')
    const name = ctx.request.header.username;
    const set = {$set: {signDate: [], signCount: 0}}
    await SignIn.updateOne({userName: name}, set).exec().then(() => {
      ctx.status = 500
      ctx.body = {
        data: '您已领取签到奖品,签到数据清空！'
      }
    }).catch(err => {
      ctx.status = 500
      ctx.body = {
        data: err + '---出错了'
      }
    })
  } catch(err) {
    ctx.status = 500
    ctx.body = {
      data: err + '---出错了'
    }
  }
})

module.exports = router
