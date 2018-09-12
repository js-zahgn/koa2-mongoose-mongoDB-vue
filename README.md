# vue-App

> A Vue.js project

Base vue + less + vue-router + vuex + vant + axios + koa2 + mongodb

## start-up mongoDB server
download mongodb
mongod

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

## Koa2 Service
```
cd service
npm install
node index.js

visit these url on browser to insert data to mongodb
1.http://127.0.0.1:2018/base/insertBaseData
2.http://127.0.0.1:2018/goods/insertGoods
3.http://127.0.0.1:2018/goods/insertCategory
4.http://127.0.0.1:2018/goods/insertCategorySub

if you want to test insert 1000000 data speed of mongodb ,you need to visit 
http://127.0.0.1:2018/test/insertInfo
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
