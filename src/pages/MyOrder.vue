<template>
  <div class="myOrder">
    <van-nav-bar title="我的订单" left-arrow @click-left="$router.go(-1)"/>
    <van-tabs v-model="active" :swipe-threshold="5" @click="changeType">
      <van-tab v-for="(type,i) in types" :key="`typeKey-${i}`" :title="type">
        <Order :orders="orderList" @getOrders="getOrderList"/>
      </van-tab>
    </van-tabs>
  </div>
</template>
<script>
import {Url} from '@/UIConfig/api'
import Order from '@/components/Order'
export default {
  name: 'myOrder',
  data() {
    return {
      active: 0,
      orderList: [],
      types: ['全部', '待付款', '待配送', '配送中', '待评价']
    }
  },
  components: {
    Order
  },
  mounted() {
    this.active = this.$route.query.type || 0;
    this.getOrderList(this.active)
  },
  methods: {
    getOrderList(t) {
      const _this = this;
      const arg = {
        type: t != undefined ? t : _this.active
      }
      _this.$http.post(Url.getUserOrderList, arg).then(res => {
        _this.orderList = res.data.data;
      })
    },
    changeType(type) {
      this.getOrderList(type)
    }
  }
}
</script>
