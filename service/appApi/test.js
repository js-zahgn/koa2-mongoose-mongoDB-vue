const mongoose = require('mongoose')
const Router = require('koa-router')
let router = new Router()

const dataList = [
  {
    name: 'A',
    age: 33,
    sex: 1,
    job: '前端',
    skill: {
      skillOne: 'HTML+CSS',
      skillTwo: 'JavaScript',
      skillThree: 'PHP'
    },
    registerTime: new Date(),
    interested: ['看电影', '看书', '吃美食', '钓鱼', '旅游']
  },
  {
    name: 'B',
    age: 30,
    sex: 1,
    job: 'JAVA后端',
    skill: {
      skillOne: 'HTML+CSS',
      skillTwo: 'J2EE',
      skillThree: 'PPT'
    },
    registerTime: new Date(),
    interested: ['做饭', '画画', '看电影']
  },
  {
    name: 'C',
    age: 20,
    sex: 1,
    job: 'UI设置',
    skill: {
      skillOne: 'PhotoShop',
      skillTwo: 'UI',
      skillThree: 'Word+Excel+PPT'
    },
    registerTime: new Date(),
    interested: ['篮球', '看电影', '做饭']
  },
  {
    name: 'D',
    age: 25,
    sex: 1,
    job: 'UI',
    skill: {
      skillOne: 'PhotoShop',
      skillTwo: 'UI',
      skillThree: 'PPT'
    },
    registerTime: new Date(),
    interested: ['写代码', '篮球', '画画']
  },
  {
    name: 'E',
    age: 28,
    sex: 1,
    job: '前端',
    skill: {
      skillOne: 'HTML+CSS',
      skillTwo: 'JavaScript',
    },
    registerTime: new Date(),
    interested: ['玩游戏', '写代码', '做饭']
  },
  {
    name: 'F',
    age: 25,
    sex: 0,
    job: '前端',
    skill: {
      skillOne: 'HTML+CSS',
      skillTwo: 'JavaScript',
    },
    registerTime: new Date(),
    interested: ['化妆', '读书', '做饭']
  },
  {
    name: 'G',
    age: 35,
    sex: 0,
    job: '美工',
    skill: {
      skillOne: 'PhotoShop',
      skillTwo: 'CAD',
    },
    registerTime: new Date(),
    interested: ['画画', '聚会', '看电影']
  },
  {
    name: 'H',
    age: 20,
    sex: 0,
    job: '美工',
    skill: {
      skillOne: 'PhotoShop',
      skillTwo: 'CAD',
    },
    registerTime: new Date(),
    interested: ['美食', '看电影', '做饭']
  },
  {
    name: 'I',
    age: 29,
    sex: 1,
    job: '前端',
    skill: {
      skillOne: 'HTML+CSS',
      skillTwo: 'JavaScript',
      skillThree: 'PHP'
    },
    registerTime: new Date(),
    interested: ['写代码', '篮球', '游泳']
  },
  {
    name: 'J',
    age: 26,
    sex: 0,
    job: '前端',
    skill: {
      skillOne: 'HTML+CSS',
      skillTwo: 'JavaScript',
      skillThree: 'PHP'
    },
    registerTime: new Date(),
    interested: ['玩游戏', '美食', '篮球']
  }
]

// 生成随机数
function GetRandomNum(min, max) {
  let range = max - min; //得到随机数区间
  let rand = Math.random(); //得到随机值
  return (min + Math.round(rand * range)); //最小值+随机数取整
}

//生成随机用户名
function GetRandomUserName(min, max) {
  let tempStringArray = "123456789qwertyuiopasdfghjklzxcvbnm".split("");
  let outPut = "";
  for (let i = 1; i < GetRandomNum(min, max); i++) {
    outPut = outPut + tempStringArray[GetRandomNum(0, tempStringArray.length)]
  }
  return outPut;
}

function genDataArr(num = 1000000) {
  const BigData = []
  for (let i = 0; i < num; i++) {
    BigData.push({
      createTime: new Date(),
      username: GetRandomUserName(7, 16),
      randNum0: GetRandomNum(100000, 999999),
      randNum1: GetRandomNum(100000, 999999),
      randNum2: GetRandomNum(100000, 999999),
      randNum3: GetRandomNum(100000, 999999),
      randNum4: GetRandomNum(100000, 999999),
      randNum5: GetRandomNum(100000, 999999),
      randNum6: GetRandomNum(100000, 999999),
      randNum7: GetRandomNum(100000, 999999),
      randNum8: GetRandomNum(100000, 999999),
      randNum9: GetRandomNum(100000, 999999),
      indexId: Number(i)
    })
  }
  return BigData
}

//100W 41634ms，10W 9013ms
router.get('/insertInfo', async(ctx) => {
  const Test = mongoose.model('testData')
  const now = new Date().getTime()
  const bulk = Test.collection.initializeOrderedBulkOp();
  const dataList = genDataArr(1000000)// 100W的数据
  for(let i = 0; i < dataList.length; i++) {
    bulk.insert(dataList[i])
  }
  bulk.execute(err => {
    if(err) console.log(err)
    const dd = new Date().getTime()
    console.log(dd - now)
  })
  ctx.body = '开始插入数据'
})

router.get('/insertData', ctx => {
  const Test = mongoose.model('testData2')
  Test.insertMany(dataList).then(res => {
    console.log(res)
    ctx.body = '插入成功'
  })
})

router.get('/getDataByIndex/:index', async(ctx) => {
  const Py = mongoose.model('pyTestData')
  const filter = {indexId: Number(ctx.params.index)}
  await Py.findOne(filter).exec().then(res => {
    ctx.body = res
  })
})

router.get('/updateInfo', async(ctx) => {
  const Test = mongoose.model('testData')

  const query = {name: 'C'}
  // $set 正常修改
  // Test.updateOne(query, {$set: {sex: 0, age: 21}}).exec()

  // $set 嵌套属性修改
  // {$set:{"interested.2":"code"} 数组后面跟索引，定位修改
  // Test.updateOne(query, {$set: {'skill.skillThree': word, job: 'UI设计'}}).exec()

  // $unset 删除一个字段
  // Test.updateOne(query, {$unset: {age: ''}}).exec()

  // $inc 在数字类型的字段原值的基础上重新加上传入的参数
  // Test.updateOne(query, {$inc: {age: -2}}).exec()

  // upsert 如果没有查询结果,就插入一条新的
  // Test.updateOne({name: 'D'}, {$set: {age: 21}}, {upsert: true}).exec()

  // 批量修改数据,警告使用updateMany
  // Test.update({}, {$set: {interested: ['book']}}, {multi: true}).exec()
  // Test.update({}, {$set:...}, false, true).exec()
  // 第三个参数为{upsert：false}简写，第四个参数为{multi:true}简写

  // 批量修改数据,可以不用multi属性
  // Test.updateMany({}, {$set: {interested: []}}).exec()

  // $push 给属性插入一条
  // Test.updateOne(query, {$push: {interested: 'movie'}}).exec()
  // $each 添加多个值到数组中
  // $sort 将数组根据字段进行排序
  // $slice 截取操作的数组
  // $pop {$pop: {interested: 1}} 1/-1从数组末端/开头删除一项
  const push = {
    $push: {
      interested: {
        $each: [{ name: 'movie', type: 1 }, { name: 'book', type: 2 }, { name: 'ball', type: 3 }],
        $sort: { type: -1 },
        // $slice: 2
      }
    }
  }
  Test.updateOne(query, push).exec()

  // $pull 删除数组中符合条件,如果结构比较复杂结合$elemMatch匹配选中项
  // {$pull:{interested:[1,2]}}
  // {$pull:{interested:{name:'movie',type:1}}}
  // {$pull:{interested:{$in:{name:['movie','book']}}}}
  // const pull = {$pull: {interested: {$elemMatch: {name: 'movie', type: 1}}}}
  const pull = {$pull: {interested: {name: {$in: ['movie', 'book']}}}}
  Test.updateOne(query, pull).exec()
  ctx.body = {
    data: '123'
  }
})

router.get('/getPyInfo', async(ctx) => {
  const Py = mongoose.model('pyTestData')
  const start = new Date().getTime()
  // 没给username加索引查询第999998 条数据用时 453ms
  // 加之后用时 19ms
  await Py.find({username: 'i9s8z2jy4enfxgp'}).exec().then((r) => {
    console.log(new Date().getTime() - start)
    ctx.body = r
  })
})

router.get('/getInfo', async(ctx) => {
  const Test = mongoose.model('testData')
  //query 表示查询条件，res表示返回的字段
  // {$lt: '<',$lte: '<=', $gt: '>', $gte: '>=', $ne: '!='}
  // $in/$nin 表示字段值在/不在后面数组中
  // $or/$and 或者/并且
  //{$or:[{name:'A'},{age:{$in:[25, 33]}}]}
  //{$and:[{name:'A'},{age:{$in:[25, 33]}}]}
  //{age:{$not:{$lte:19,$gte:45}}}查找除了小于19岁的和大于45岁的
  // const query = {'skill.skillOne': 'HTML+CSS', age: {$in: [25, 33]}}
  // const res = {name: 1, 'skill.skillOne': 1, _id: 0}
  // const queryRes = await Test.find(query, res)
  // console.log(queryRes)

  // 数组查询
  // $all 数组中全部满足条件
  // $in 数组项满足其中一个
  // $size 该数组字段的长度满足size
  // $slice 截取数组字段(在resKey中设置)可传负值,表示从数组末位开始截取
  // $where 该查询语句中this指向被查询对象整体集合,对数据库压力大,安全性重,慎用
  // $regex 模糊查询 {name:{$regex:queryName}} || {name:{}}
  // const query = {interested: {$all: ['看电影', '做饭']}}
  // const query = {interested: {$size:5}}
  // const query = {$where: "this.age>30"}
  // const query = {interested: {$in: ['看电影', '做饭']}}
  // const resKey = {name: 1, age: 1, job: 1, _id: 0, interested: {$slice: 2}}
  // const queryRes = await Test.find(query, resKey)

  // 创建索引Test.createIndex({username: 1,randNum0:565509})
  // 两条以上的索引为复合索引，使用hint()指定优先使用某个索引
  // Test.find({username:'7xwb8y3',randNum0:565509}).hint({randNum0:1});
  // 查询索引Test.getIndexes()
  // 删除索引Test.dropIndex('username_1')//参数索引查询表中的name值
  // 全文索引----Test.createIndex({words:'text'})，text关键字代表全文索引
  // Test.find({$text:{$search:"firstWord secondWord -noWord \"continue word\""}})
  // 1、多个查询内容用空格隔开;
  // 2、希望不包含某内容用-减号;
  // 3、查询连续内容使用\转义字符
  /* 使用索引注意事项：
     1、数据不过万条不使用索引
     2、查询数据超过表数据量30%时，不适用
     3、数字索引比字符串索引查询速度快
     4、把经常查的数据做成对象型数据,进行集体索引
  */
  const start = new Date().getTime()
  // 给username加了索引用时查询第19500 * 50 条数据用时 7ms
  await Test.find({username: '4ujt4ql'}).exec().then((res) => {
    console.log(new Date().getTime() - start)
    ctx.body = res
  })
})

module.exports = router
