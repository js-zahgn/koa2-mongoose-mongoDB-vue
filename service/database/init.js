const mongoose = require('mongoose')
const db = 'mongodb://localhost/laozhangDB'

mongoose.Promise = global.Promise
// 去除使用findAndModify,ensureIndex,update,save时出现的警告
// mongoose >=5.2.10
mongoose.set('useCreateIndex', true)
// mongoose <=5.2.8
// mongoose.set('useFindAndModify', false)

exports.connect = () => {
  // 链接数据库
  mongoose.connect(db, {useNewUrlParser: true})
  let maxConnectCount = 0

  return new Promise((resolve, reject) => {
    // 增加数据库链接的事件监听
    mongoose.connection.on('disconnected', (err) => {
      console.log('*******数据库链子断了*******')
      if (maxConnectCount < 3) {
        maxConnectCount++
        // 进行重连
        mongoose.connect(db, {useNewUrlParser: true})
      } else {
        reject(err)
        throw new Error('数据库已死，请进行人工呼吸。。。')
      }
    })

    // 数据库出错
    mongoose.connection.on('error', err => {
      console.log('*******数据库抛锚了*******')
      if (maxConnectCount < 3) {
        maxConnectCount++
        // 进行重连
        mongoose.connect(db, {useNewUrlParser: true})
      } else {
        reject(err)
        throw new Error('数据库已死，请进行人工呼吸。。。')
      }
    })

    // 链接打开
    mongoose.connection.once('open', () => {
      console.log('MongoDB Connected successfully!')
      resolve()
    })
  })
}

const glob = require('glob')
const {resolve} = require('path')

exports.initSchemas = () => {
  glob.sync(resolve(__dirname, './schema/', '**/*.js')).forEach(require)
}
