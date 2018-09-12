const mongoose = require('mongoose')
const Router = require('koa-router')
const fs = require('fs')
let router = new Router()

// 插入省市区数据
router.get('/insertAddress', async(ctx) => {
  fs.readFile('./dataJson/address.json', 'utf8', (err, data) => {
    console.log(err)
    const AddressData = mongoose.model('addressData')
    const newAddressData = new AddressData(JSON.parse(data))
    newAddressData.save().then(() => {
      console.log('成功')
    }).catch(error => console.log(`失败->${error}`))
  })
  ctx.body = '开始导入地址数据'
})

// 获取省市区数据
router.get('/getAddressData', async(ctx) => {
  const AddressData = mongoose.model('addressData')
  await AddressData.find({}).exec().then(res => {
    ctx.status = 200
    ctx.body = { data: res[0] }
  }).catch(err => {
    ctx.status = 500
    ctx.body = {
      data: '获取地址数据出错-->' + err
    }
  })
})

// 获取地址列表
router.get('/getAddressList', async(ctx) => {
  try{
    const Addr = mongoose.model('Address')
    const name = ctx.request.header.username
    const result = await Addr.find({userName: name}).sort({isDefault: -1})
    ctx.status = 200
    ctx.body = { data: result }
  } catch(err) {
    ctx.status = 500
    ctx.body = {
      data: '获取地址列表出错-->' + err
    }
  }
})

// 获取默认地址
router.get('/getDefaultAddress', async(ctx) => {
  try{
    const Addr = mongoose.model('Address')
    const name = ctx.request.header.username
    const result = await Addr.find({userName: name, isDefault: true})
    ctx.status = 200
    ctx.body = { data: result ? result[0] : null }
  } catch (err) {
    ctx.status = 500
    ctx.body = {
      data: '获取默认地址出错-->' + err
    }
  }
})

// 添加新地址
router.post('/addNewAddress', async(ctx) => {
  try {
    const Addr = mongoose.model('Address')
    const {body} = ctx.request;
    const name = ctx.request.header.username;
    body.userName = name;
    const newAddr = new Addr(body)
    const query = {userName: name}
    if(body.isDefault) {
      const set = {$set: {isDefault: false}}
      // 设置唯一默认地址
      await Addr.updateMany(query, set).exec().then(async() => {
        await newAddr.save().then(() => {
          ctx.status = 200
          ctx.body = { data: '添加地址成功' }
        })
      })
    } else {
      await Addr.find(query).exec().then(async(res) => {
        if(res.length < 1) {
          await newAddr.save().then(() => {
            ctx.status = 200
            ctx.body = { data: '添加地址成功' }
          })
        } else {
          let defBody = JSON.parse(JSON.stringify(body))
          defBody.isDefault = true;
          const newDefAddr = new Addr(defBody)
          await newDefAddr.save().then(() => {
            ctx.status = 200
            ctx.body = { data: '添加地址成功' }
          })
        }
      })
    }
  }catch (err) {
    ctx.status = 500
    ctx.body = { data: "新增地址出错-->" + err }
  }
})

// 编辑地址信息
router.post('/editAddressInfo', async(ctx) => {
  try {
    const Addr = mongoose.model('Address')
    const {body} = ctx.request;
    const name = ctx.request.header.username;
    const {id, userName, ...rest} = body
    const updateSet = {$set: rest}
    if(body.isDefault) {
      const query = {userName: name}
      const defSet = {$set: {isDefault: false}}
      await Addr.updateMany(query, defSet).exec().then(async() => {
        await Addr.findByIdAndUpdate(body.id, updateSet).exec().then(res => {
          ctx.status = 200
          ctx.body = {
            data: '修改成功'
          }
        })
      })
    } else {
      await Addr.findByIdAndUpdate(body.id, updateSet).exec().then(res => {
        ctx.status = 200
        ctx.body = {
          data: '修改成功'
        }
      })
    }
  } catch(err) {
    ctx.status = 500
    ctx.body = {
      data: "编辑地址出错-->" + err
    }
  }
})

// 删除地址
router.post('/deleteOneAddress', async(ctx) => {
  try {
    const Addr = mongoose.model('Address')
    const name = ctx.request.header.username;
    const {id, isDefault} = ctx.request.body;
    if(isDefault) {
      const query = {userName: name}
      const defSet = {$set: {isDefault: true}}
      await Addr.findByIdAndRemove(id).exec().then(async() => {
        await Addr.updateOne(query, defSet).exec().then(() => {
          ctx.status = 200
          ctx.body = {
            data: '刪除成功'
          }
        }).catch(err => {
          ctx.status = 200
          ctx.body = {
            data: '刪除成功-->' + err
          }
        })
      })
    } else {
      await Addr.findByIdAndRemove(id).exec().then(() => {
        ctx.status = 200
        ctx.body = {
          data: '刪除成功'
        }
      })
    }
  } catch(err) {
    ctx.status = 500
    ctx.body = {
      data: "刪除地址出错-->" + err
    }
  }
})

module.exports = router
