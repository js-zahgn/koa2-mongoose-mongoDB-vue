/**
 * 需求
 * 这个表有100万的document，我需要遍历他，每次拿出来10条文档，对其进行1个比较耗时的处理，会利用callback返回，进行下10条文档的处理。
 * 直接使用如下代码，把所有100万数据都放入内存，然后利用async处理，我知道比较蠢，测试了一下，内存猛涨
 */

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost/sample';
MongoClient.connect(url, function (err, db) {
  if (err) {
    return console.log("connection failed: %s", err);
  }
  console.log('connected to mongo, ready for duty work');
  var collection = db.collection('files');
  //setInterval(function(){ console.log('memroy usage : %j',process.memoryUsage());},10000);
  /** fetch all records **/
  var stream = collection.find().stream()
  var cache = [];
  stream.on('data', function (item) {
    cache.push(item);
    if (cache.length == 10) {
      /** signal mongo to pause reading **/
      stream.pause();
      process.nextTick(function () {
        doLotsWork(cache, function () {
          cache = [];
          /** signal mongo to continue, fetch next record **/
          stream.resume();
        });
      });
    }
  });
  stream.on('end', function () {
    console.log('query ended');
  });
  stream.on('close', function () {
    console.log('query closed');
  });
});

function doLotsWork(records, callback) {
  //.....do lots of work
  //.....
  //all done, ready to deal with next 10 records
  process.nextTick(function () {
    callback();
  });
}
