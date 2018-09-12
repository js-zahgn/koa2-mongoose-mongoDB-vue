const Router = require('koa-router');
const mongoose = require('mongoose');
let router = new Router();

const checkToken = require('../token/checkToken.js');

// 通过用户查询购物车
router.get('/getCartInfoById', checkToken, async(ctx) => {
  try{
    const name = ctx.request.header.username
    const Cart = mongoose.model('Cart')
    const res = await Cart.findOne({userName: name});
    ctx.status = 200
    ctx.body = {
      data: res ? res.goodsList : []
    }
  }catch(err) {
    ctx.status = 500
    ctx.body = {data: err}
  }
})

// 加入购物车功能
router.post('/addGoodsToCart', checkToken, async(ctx) => {
  try{
    const { goods } = ctx.request.body
    const name = ctx.request.header.username;
    const Cart = mongoose.model('Cart')
    const query = {userName: name}
    const result = await Cart.findOne(query);
    if(result) {
      const origCartGoods = Object.assign([], result.goodsList);
      if(origCartGoods.find(item => item.Id == goods.Id)) {
        ctx.status = 500
        ctx.body = { data: '购物车中已有此商品' }
      } else {
        await Cart.updateOne(query, {$push: {goodsList: goods}}).exec().then(() => {
          ctx.status = 200
          ctx.body = { data: '添加成功' }
        })
      }
    } else {
      await Cart.updateOne(query, {$addToSet: {goodsList: goods}}, {upsert: true}).exec().then(() => {
        ctx.status = 200
        ctx.body = { data: '添加成功' }
      })
    }
  } catch(err) {
    ctx.status = 500
    ctx.body = { data: err + '搓搓' }
  }
})

// 改变购物车商品数量
router.post('/changeCartGoodsCount', async(ctx) => {
  try{
    const { goodsId, count } = ctx.request.body
    const name = ctx.request.header.username;
    const Cart = mongoose.model('Cart')
    const set = {$set: {"goodsList.$[goods].Count": count}}
    const arrayFilters = {
      arrayFilters: [{"goods.Id": goodsId}]
    }
    await Cart.updateOne({userName: name}, set, arrayFilters).exec().then(async() => {
      ctx.status = 200
      ctx.body = {
        data: '修改商品数量OK'
      }
    }).catch(err => {
      ctx.status = 500
      ctx.body = {
        data: `修改商品数量出错=>${err}`
      }
    })
  } catch(err) {
    ctx.status = 500
    ctx.body = { data: err + '搓搓' }
  }
})

// 清空购物车
router.post('/clearCartGoods', async(ctx) => {
  try{
    const name = ctx.request.header.username;
    const Cart = mongoose.model('Cart')
    const set = {$set: {goodsList: []}}
    await Cart.updateOne({userName: name}, set).exec().then(async(res) => {
      ctx.status = 200
      ctx.body = {
        data: '清空购物车OK'
      }
    }).catch(err => {
      ctx.status = 500
      ctx.body = {
        data: `清空购物车出错=>${err}`
      }
    })
  } catch(err) {
    ctx.status = 500
    ctx.body = { data: err + '搓搓' }
  }
})

// 删除单个商品
router.post('/deleteGoodsFromCart', async(ctx) => {
  try{
    const { goodsId } = ctx.request.body;
    const name = ctx.request.header.username;
    const Cart = mongoose.model('Cart')
    const pull = {$pull: {goodsList: {"Id": goodsId}}}
    await Cart.updateOne({userName: name}, pull).exec().then(() => {
      ctx.status = 200
      ctx.body = {
        data: '删除商品OK'
      }
    }).catch(err => {
      ctx.status = 500
      ctx.body = {
        data: `删除商品出错=>${err}`
      }
    })
  } catch(err) {
    ctx.status = 500
    ctx.body = { data: err + '搓搓' }
  }
})

module.exports = router
