<template>
  <div class="userInfoPage">
    <SignIn />
    <div class="orderStatus">
      <div class="title">
        <span>我的订单</span>
        <i @click="$router.push({name: 'myOrder', query: {type: 0}})">查看全部订单</i>
      </div>
      <ul>
        <li @click="$router.push({name: 'myOrder', query: {type: 1}})">
          <em v-if="orderStatus.notPay>0">{{orderStatus.notPay |　count}}</em>
          <van-icon name="gold-coin"/>
          <span>待付款</span>
        </li>
        <li @click="$router.push({name: 'myOrder', query: {type: 2}})">
          <em v-if="orderStatus.notDispatch>0">{{orderStatus.notDispatch |　count}}</em>
          <van-icon name="shopping-cart"/>
          <span>待配送</span>
        </li>
        <li @click="$router.push({name: 'myOrder', query: {type: 3}})">
          <em v-if="orderStatus.notArrive>0">{{orderStatus.notArrive |　count}}</em>
          <van-icon name="receive-gift"/>
          <span>配送中</span>
        </li>
        <li @click="$router.push({name: 'myOrder', query: {type: 4}})">
          <em v-if="orderStatus.notEvaluate>0">{{orderStatus.notEvaluate |　count}}</em>
          <van-icon name="description"/>
          <span>待评价</span>
        </li>
      </ul>
    </div>
    <ul class="operationList">
      <li @click="$router.push('/address')">
        <i><van-icon name="location"/></i><span>地址管理</span><van-icon name="arrow"/>
      </li>
      <li @click="$router.push('/changePwd')">
        <i><van-icon name="edit-data"/></i><span>修改密码</span><van-icon name="arrow"/>
      </li>
      <li @click="logout">
        <i><van-icon name="close"/></i><span>退出登录</span><van-icon name="arrow"/>
      </li>
    </ul>
    <PublicFooter :activeItem="3"/>
  </div>
</template>
<script>
import {Url} from '@/UIConfig/api'
import PublicFooter from '@/components/PublicFooter'
import SignIn from '@/components/SignIn'
export default {
  name: 'myInfo',
  data() {
    return {
      orderStatus: {}
    }
  },
  components: {
    PublicFooter, SignIn
  },
  created () {
    const _this = this;
    _this.$http.get(Url.getUserOrderCount).then(res => {
      _this.orderStatus = res.data.data;
    })
  },
  methods: {
    logout() {
      localStorage.removeItem('userName')
      localStorage.removeItem('token')
      this.$router.push('/login')
    }
  },
  filters: {
    count(val) {
      return val > 99 ? '...' : val
    }
  }
}
</script>
<style lang="less" scoped>
.userInfoPage{
  padding-bottom: 50px;
  .orderStatus{
    padding: 10px;
    .title{
      font-size: .75rem;
      display: flex;
      i{
        flex:1;
        text-align: right;
      }
    }
    ul{
      display: flex;
      margin-top: 1rem;
      li{
        position: relative;
        flex:1;
        color: #ccc;
        display: flex;
        flex-direction: column;
        text-align: center;
        i{
          font-size: 1.5rem;
        }
        span{
          font-size: .75rem;
          line-height: 2rem;
          color: #555555;
        }
        em{
          position: absolute;
          width: .85rem;
          height: .85rem;
          line-height: .85rem;
          background-color: #FB4C20;
          color: #fff;
          font-size: .6rem;
          border-radius: 50%;
          right: 25%;
          top: -10%;
          z-index: 1;
        }
      }
    }
  }
  .operationList{
    padding-top: .75rem;
    background-color: #EFEFEF;
    >li{
      background-color: #fff;
      width: 100%;
      line-height: 2.5rem;
      padding-top: .2rem;
      border-bottom: 1px solid #ddd;
      >i:nth-child(1){
        display: inline-block;
        width: 1.5rem;
        height: 1.5rem;
        line-height: 1.8rem;
        margin:5px 10px;
        text-align: center;
        border-radius: 50%;
        color: #fff;
      }
      >i{
        color: #ccc;
      }
      >span{
        display: inline-block;
        width: 75%;
        padding-left: 1rem;
      }
      
    }
    >li:nth-child(1){
      >i:nth-child(1){
        background-color: #FCD839;
      }
    }
    >li:nth-child(2){
      >i:nth-child(1){
        background-color: #B2D483;
      }
    }
    >li:nth-child(3){
      >i:nth-child(1){
        background-color: #FB4C20;
      }
    }
  }
}
</style>

