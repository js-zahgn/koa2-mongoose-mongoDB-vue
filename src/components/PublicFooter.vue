<template>
  <van-tabbar v-model="theIndex">
    <van-tabbar-item icon="home" to="/">商城</van-tabbar-item>
    <van-tabbar-item icon="wap-nav" to="/categoryList">分类</van-tabbar-item>
    <van-tabbar-item icon="cart" to="/theCart">购物车</van-tabbar-item>
    <van-tabbar-item icon="contact" to="/myInfo">会员中心</van-tabbar-item>
  </van-tabbar>
</template>
<script>
export default {
  name: 'publicFooter',
  props: ['activeItem'],
  data() {
    return {
      theIndex: this.activeItem
    }
  }
}
</script>
