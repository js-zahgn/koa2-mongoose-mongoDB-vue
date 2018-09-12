const mongoose = require('mongoose')
const Router = require('koa-router')
let router = new Router()

const checkToken = require('../token/checkToken.js');
const createToken = require('../token/createToken.js');

// 获取用户订单数量
router.get('/getUserOrderCount', checkToken, async(ctx) => {
  try{
    const name = ctx.request.header.username;
    const Order = mongoose.model('Order')
    const notPay = await Order.find({userName: name, status: 1})
    const notDispatch = await Order.find({userName: name, status: 2})
    const notArrive = await Order.find({userName: name, status: 3})
    const notEvaluate = await Order.find({userName: name, status: 4})
    ctx.status = 200;
    ctx.body = {
      data: {
        notPay: notPay.length,
        notDispatch: notDispatch.length,
        notArrive: notArrive.length,
        notEvaluate: notEvaluate.length
      }
    }
  } catch (err) {
    ctx.status = 500;
    ctx.body = {
      data: '获取订单数量出错==>' + err
    }
  }
})

// 获取用户订单
router.post('/getUserOrderList', checkToken, async(ctx) => {
  try{
    const {type} = ctx.request.body
    const name = ctx.request.header.username;
    const Order = mongoose.model('Order');
    const query = Number(type) == 0 ? {userName: name} : {userName: name, status: type}
    const res = await Order.find(query).sort({_id: -1})
    ctx.status = 200;
    ctx.body = {
      data: res
    }
  } catch (err) {
    ctx.status = 500;
    ctx.body = {
      data: '获取订单出错==>' + err
    }
  }
})

// 生成订单
router.post('/createOrder', checkToken, async(ctx) => {
  try {
    const {goods, total, payType, address} = ctx.request.body;
    const name = ctx.request.header.username;
    const Order = mongoose.model('Order');
    const Cart = mongoose.model('Cart');
    const newOrder = new Order({
      userName: name,
      goods: goods,
      total: total,
      address: address,
      payType: payType,
      status: payType == 0 ? 1 : (payType == 3 ? 3 : 2),
      token: createToken(name)
    })
    const ids = goods.map(e => e.Id)
    const query = {userName: name}
    await Cart.updateOne(query, {$pull: {goodsList: {Id: {$in: ids}}}}).exec().then(async() => {
      await newOrder.save().then(() => {
        ctx.status = 200
        ctx.body = {
          data: `提交订单成功${payType == 0 ? '，未付款' : payType == 3 ? '，货到付款' : ''}`
        }
      }).catch(err => {
        ctx.status = 500
        ctx.body = {
          data: `提交订单失败=>${err}`
        }
      })
    }).catch(err => {
      ctx.status = 500
      ctx.body = {
        data: `删除购物车中商品失败=>${err}`
      }
    })
  } catch (err) {
    ctx.status = 500
    ctx.body = {
      data: '生成订单出错==>' + err
    }
  }
})

// 删除订单
router.post('/deleteOrder', checkToken, async(ctx) => {
  try {
    const {id} = ctx.request.body;
    const Order = mongoose.model('Order')
    await Order.findByIdAndRemove(id, () => {
      ctx.status = 200;
      ctx.body = {
        data: '删除成功'
      }
    })
  } catch(err) {
    ctx.status = 500
    ctx.body = {
      data: '删除订单出错==>' + err
    }
  }
})

module.exports = router
