<template>
  <div class="orderBox">
    <h2 v-if="orders.length == 0">暂无此状态订单</h2>
    <van-pull-refresh v-model="isRefresh" @refresh="onRefresh" v-else>
      <ul class="orderList">
        <li v-for="order in orders" :key="order._id">
          <ul>
            <li v-for="good in order.goods" :key="good._id" class="goods">
              <div class="imgBox">
                <img :src="good.Image" width="100%" :onerror="errImg"/>
              </div>
              <p>{{good.Name}}</p>
              <div class="priceBox">
                <b>￥{{good.Price | toMon}}</b>
                <i>￥{{good.OriPrice | toMon}}</i>
                <span>x{{good.Count}}</span>
              </div>
            </li>
          </ul>
          <div class="footerUp">
            <span>共{{order.goods | goodsCount}}件商品</span>
            <span>合计：￥{{order.total | toMon}}</span>
            <i v-if="order.total<59">(含运费￥3.00)</i>
          </div>
          <div class="footer">
            <van-button @click="deleteOrder(order._id)">删除订单</van-button>
          </div>
        </li>
      </ul>
    </van-pull-refresh>
    
  </div>
</template>
<script>
import {Dialog, Toast} from 'vant'
import {toMoney} from '@/UIConfig/filters'
import {Url} from '@/UIConfig/api'
export default {
  name: 'orderList',
  props: ['orders', 'type'],
  data() {
    return {
      isRefresh: false
    }
  },
  methods: {
    onRefresh() {
      const _this = this
      setTimeout(() => {
        _this.isRefresh = false;
        _this.$emit('getOrders')
      }, 500)
    },
    deleteOrder(id) {
      const _this = this;
      Dialog.confirm({
        message: '删除订单将不可撤回！'
      }).then(() => {
        _this.$http.post(Url.deleteOrder, {id: id}).then(res => {
          Toast.success(res.data.data)
          _this.$emit('getOrders')
        })
      });
    }
  },
  filters: {
    goodsCount(list) {
      return list.map(item => item.Count).reduce((a, b) => a + b)
    },
    toMon(m) {
      return toMoney(m)
    }
  }
}
</script>
<style lang="less" scoped>
.orderBox{
  padding-top: .75rem;
  background-color: #F4F4F4;
  >h2{
    text-align: center;
    color:#a5a5a5;
    line-height: 5rem;
    padding-bottom: 100%;
  }
  .orderList{
    >li{
      background-color: #fff;
      font-size: .75rem;
      border-bottom: 1px solid #e2e2e2;
      padding: .5rem;
      .goods{
        display: flex;
        margin-bottom: .5rem;
        .imgBox{
          flex: 3;
        }
        >p{
          flex: 7;
          padding:0 .5rem;
        }
        .priceBox{
          flex: 2;
          display: flex;
          flex-direction: column;
          text-align: right;
          i{
            text-decoration: line-through;
            color: #a5a5a5;
          }
        }
      }
      .footerUp{
        line-height: 2rem;
        text-align: right;
      }
      .footer{
        text-align: right;
        padding-top: .5rem;
        border-top: 1px solid #e2e2e2;
        button{
          height: 1.85rem;
          line-height: 1.85rem;
        }
      }
    }
    >li+li{
      margin-top: .75rem;
    }
  }
}
</style>
