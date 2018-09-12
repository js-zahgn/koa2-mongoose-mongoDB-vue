<template>
  <div>
    <div class="navBarBox">
      <van-nav-bar
        title="商品详情"
        left-text="返回"
        left-arrow
        @click-left="$router.go(-1)"/>
    </div>
    <div class="topImageBox">
      <img :src="goods.IMAGE1" width="100%">
    </div>
    <div class="goodsName">{{goods.NAME}}</div>
    <div class="goodsPrice">价格：￥{{goods.PRESENT_PRICE | toMoney}}</div>
    <div>
      <van-tabs swipeable sticky>
        <van-tab title="商品详情">
          <div class="detail" v-html="goods.DETAIL"></div>
        </van-tab>
        <van-tab title="评价">
          collecting
        </van-tab>
      </van-tabs>
    </div>
    <div class="goodsBottom">
      <van-goods-action>
        <van-goods-action-mini-btn icon="cart" text="购物车" :info="gooodsCount"
              @click="$router.push('/theCart')"/>
        <van-goods-action-big-btn text="加入购物车" @click="addToCart" />
        <van-goods-action-big-btn text="立即购买" @click="buyRightNow" primary />
      </van-goods-action>
    </div>
    
  </div>
</template>
<script>
import { Toast } from 'vant'
import { Url } from '@/UIConfig/api'
import { toMoney } from '@/UIConfig/filters.js'

export default {
  name: 'goods',
  data() {
    return {
      goodsId: this.$route.query.goodsId,
      goods: {},
      gooodsCount: 0
    }
  },
  created() {
    const _this = this
    _this.$http.post(Url.getDetailGoodsInfo, {goodsId: _this.goodsId}).then(res => {
      _this.goods = res.data.data
    })
    _this.getCartGoodsCount()
  },
  methods: {
    getCartGoodsCount() {
      const _this = this;
      _this.$http.get(Url.getCartInfoByUserId).then(res => {
        _this.gooodsCount = res.data.data.length
      })
    },
    addToCart() {
      const _this = this;
      const param = {
        name: localStorage.userName,
        goods: {
          Id: _this.goodsId,
          Name: _this.goods.NAME,
          Price: _this.goods.PRESENT_PRICE,
          Image: _this.goods.IMAGE1,
          OriPrice: _this.goods.ORI_PRICE,
          Count: 1,
        }
      }
      _this.$http.post(Url.addGoodsToCart, param).then(res => {
        if(res.data.data) {
          Toast.success('添加成功')
          _this.getCartGoodsCount()
          _this.$router.push('/theCart')
        }
      })
    },
    buyRightNow() {
      const _this = this
      const price = _this.goods.PRESENT_PRICE
      if(price < 59) {
        Toast('商品未满59元，需加3元邮费')
      }
      const param = {
        total: price < 59 ? price + 3 : price,
        goods: [{
          Id: _this.goodsId,
          Name: _this.goods.NAME,
          Price: _this.goods.PRESENT_PRICE,
          OriPrice: _this.goods.ORI_PRICE,
          Image: _this.goods.IMAGE1,
          Count: 1,
        }]
      }
      localStorage.setItem('orderInfo', JSON.stringify(param))
      _this.$store.dispatch('submitOrder', param)
      _this.$router.push('/confirmOrder')
    }
  },
  filters: {
    toMoney(val) {
      return toMoney(val)
    }
  }
}
</script>

<style scoped lang="less">
.detail{
  font-size:0px;
  padding-bottom: 60px; 
}
.goodsName{
  background-color: #fff;
}
.goodsPrice{
  background-color: #fff;
}
.goodsBottom{
  position: fixed;
  bottom: 0;
  left: 0;
  background-color: #fff;
  width: 100%;

  display: flex;
  flex-direction: row;
  flex-flow: nowrap;
  >div{
    flex: 1;
    padding: 5px;
  }
}
</style>