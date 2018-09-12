const Koa = require('koa')
const Router = require('koa-router')
const app = new Koa()
const port = 2018
const {connect, initSchemas} = require('./database/init.js')
const bodyParser = require('koa-bodyparser')
const cors = require('koa2-cors')

// 解决跨域问题
app.use(cors())
// 接收前端请求
app.use(bodyParser())

let base = require('./appApi/baseData.js')
let user = require('./appApi/user.js')
let sign = require('./appApi/signIn.js')
let goods = require('./appApi/goods.js')
let cart = require('./appApi/cart.js')
let address = require('./appApi/address.js')
let order = require('./appApi/order.js')
let test = require('./appApi/test.js')
// 装载子路由
let router = new Router()
router.use('/base', base.routes())
router.use('/user', user.routes(), user.allowedMethods())
router.use('/sign', sign.routes(), sign.allowedMethods())
router.use('/goods', goods.routes())
router.use('/cart', cart.routes(), cart.allowedMethods())
router.use('/address', address.routes())
router.use('/order', order.routes(), order.allowedMethods())
router.use('/test', test.routes())
// 路由中间件
app.use(router.routes())
app.use(router.allowedMethods())

// 立即执行函数
;(async () => {
  await connect()
  initSchemas()
})()

app.listen(port, () => console.log(`[Server] starting at port ${port}`))
