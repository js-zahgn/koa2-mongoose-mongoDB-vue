const mongoose = require('mongoose')
const fs = require('fs')
const Router = require('koa-router')
let router = new Router()

router.get('/insertBaseData', async(ctx) => {
  fs.readFile('./dataJson/base_data.json', 'utf-8', (err, data) => {
    console.log(err)
    const BaseData = mongoose.model('baseData')
    const newBaseData = new BaseData(JSON.parse(data))
    newBaseData.save().then(() => {
      console.log('成功')
    }).catch(error => console.log(`失败->${error}`))
  })
  ctx.body = '开始导入基础数据'
})

router.get('/getBaseData', async(ctx) => {
  try {
    const BaseData = mongoose.model('baseData')
    await BaseData.find({}).exec().then(res => {
      ctx.status = 200
      ctx.body = { data: res[0] }
    })
  } catch (err) {
    ctx.status = 500
    ctx.body = { data: '获取数据出错==>' + err }
  }
})

module.exports = router
