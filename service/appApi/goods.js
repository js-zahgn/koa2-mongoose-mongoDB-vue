const Router = require('koa-router')
let router = new Router()

const mongoose = require('mongoose')
const fs = require('fs')

// 插入商品
router.get('/insertGoods', async(ctx) => {
  fs.readFile('./dataJson/goods_copy.json', 'utf8', (...arg) => {
    // arg[0] err
    // const now = new Date().getTime()
    const Goods = mongoose.model('Goods')
    Goods.insertMany(JSON.parse(arg[1]))
  })
  ctx.body = "开始导入商品数据"
})

// 插入商品大类
router.get('/insertCategory', async(ctx) => {
  fs.readFile('./dataJson/category.json', 'utf8', (...arg) => {
    const Category = mongoose.model('Category')
    Category.insertMany(JSON.parse(arg[1]).RECORDS)
  })
  ctx.body = '开始导入商品类别数据'
})

// 插入商品小类
router.get('/insertCategorySub', async(ctx) => {
  fs.readFile('./dataJson/category_sub.json', 'utf8', (...arg) => {
    const CategorySub = mongoose.model('CategorySub')
    CategorySub.insertMany(JSON.parse(arg[1]).LIST)
  })
  ctx.body = '开始导入商品列表数据'
})

// 获取商品详细信息的接口
router.post('/getDetailGoodsInfo', async(ctx) => {
  try {
    let goodsId = ctx.request.body.goodsId
    const Goods = mongoose.model('Goods')
    const res = await Goods.findOne({ID: goodsId})
    ctx.status = 200
    ctx.body = {data: res}
  } catch (err) {
    ctx.status = 500
    ctx.body = {data: err}
  }
})

// 获取商品大类
router.get('/getCategoryList', async(ctx) => {
  try{
    const Category = mongoose.model('Category')
    let res = await Category.find().sort({SORT: 1})
    ctx.status = 200
    ctx.body = {data: res}
  } catch (err) {
    ctx.status = 500
    ctx.body = {data: err}
  }
})

// 获取商品小类
router.post('/getCategorySub', async(ctx) => {
  try{
    const postId = ctx.request.body.categoryId || 1
    const CategorySub = mongoose.model('CategorySub')
    const res = await CategorySub.find({MALL_CATEGORY_ID: postId})
    ctx.status = 200
    ctx.body = {data: res}
  } catch (err) {
    ctx.status = 500
    ctx.body = {data: err}
  }
})

// 根据类别获取商品
router.post('/getGoodsListByCategorySubID', async(ctx) => {
  try{
    const Goods = mongoose.model('Goods')
    const {categorySubId, pageSize, pageNo} = ctx.request.body;
    const startIndex = (pageNo - 1) * pageSize;
    const query = {SUB_ID: categorySubId}
    const total = await Goods.find(query).countDocuments(true)
    const res = await Goods.find(query).skip(startIndex).limit(pageSize);
    ctx.status = 200
    ctx.body = {
      data: {
        count: total,
        list: res
      }
    }
  } catch (err) {
    ctx.status = 500
    ctx.body = {data: err}
  }
})

// 通过商品名称查找商品
router.post('/getGoodsListByName', async(ctx) => {
  try{
    const Goods = mongoose.model('Goods')
    const {name} = ctx.request.body;
    const res = await Goods.find({NAME: {$regex: name}})
    ctx.status = 200
    ctx.body = {
      list: res
    }
  } catch (err) {
    ctx.status = 500
    ctx.body = {data: err}
  }
})

// 分页获取搜索商品列表
router.post('/getSearchGoodsList', async(ctx) => {
  try{
    const Goods = mongoose.model('Goods')
    const {name, size, lastID} = ctx.request.body
    // const start = (pageNo - 1) * size;
    const query = {NAME: {$regex: name}}
    const total = await Goods.find(query).countDocuments(true)
    const timeQuery = {NAME: {$regex: name}, ID: {$lt: lastID}}
    await Goods.find(timeQuery).sort({ID: -1}).limit(size).exec()
      .then(res => {
        ctx.status = 200
        ctx.body = {
          list: res,
          count: total
        }
      })
    // skip函数在数据量较大时，性能不佳
    // await Goods.find(query).skip(start).limit(size).exec()
    //   .then(res => {
    //     ctx.status = 200
    //     ctx.body = {
    //       list: res,
    //       count: total
    //     }
    //   })
  } catch(err) {
    ctx.status = 500
    ctx.body = {data: err}
  }
})

module.exports = router
