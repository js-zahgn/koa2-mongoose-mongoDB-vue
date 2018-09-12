const Koa = require('koa')
const app = new Koa()
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const cors = require('koa2-cors')
const mongoose = require('mongoose')
const {connect, initSchemas} = require('./database/init.js')

app.use(cors())
app.use(bodyParser())
let router = new Router()
app.use('/base', router.get('/getBaseData', async(ctx) => {
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
}))

// app.use(async(ctx) => {
//   ctx.cookies.set(
//     'cid',
//     'hello world',
//     {
//       maxAge: 10 * 60 * 1000, // cookie有效时长
//       httpOnly: false,
//       overwrite: false
//     }
//   )
//   console.log(ctx.cookies.get('cid'))
//   ctx.body = 'cookie is ok'
// })

app.use(router.routes()).use(router.allowedMethods())
// app.use(router.allowedMethods())
app.use((ctx, next) => {
  next();
});
// 立即执行函数
;(async () => {
  await connect()
  initSchemas()
})()

app.listen(2004, () => {
  console.log('[demo] cookie is starting at port 2004')
});
