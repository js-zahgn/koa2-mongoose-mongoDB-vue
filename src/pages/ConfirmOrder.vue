<template>
  <div class="confirmOrder">
    <van-nav-bar title="确认订单"
                left-text="返回"
                left-arrow
                @click-left="$router.go(-1)"/>
    <div class="content">
      <div class="address">
        <div class="addrInfo">
          <div class="name"><van-icon name="location"></van-icon></div>
          <div class="detail" v-if="shipAddress">
            <div><span>收货人：{{shipAddress.user}}</span><i>{{shipAddress.mobileNO}}</i></div>
            <p>
              <span>收货地址：{{shipAddress.province.name}}</span>
              <span>{{shipAddress.city.name}}</span>
              <span>{{shipAddress.county.name}}</span>
              <span>{{shipAddress.detail}}</span>
            </p>
          </div>
          <div class="edit" @click="$router.push({name:'addressManage',query:{radio: true}})">
            <van-icon name="arrow"/>
          </div>
        </div>
        <div class="bottomBg"></div>
        <div class="bottomColor"></div>
      </div>
      <div class="goods">
        <div class="goodInfo" v-for="gg in balanceOrder.goods" :key="gg.Id">
          <div class="imgBox"><img :src="gg.Image" width="100%" :onerror="errImg"></div>
          <div class="text">
            <div>{{gg.Name}}</div>
            <div class="control">
              <div class="price">￥{{gg.Price | money}}</div>
              <span>x{{gg.Count}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="sendWay">
        <div>配送方式</div>
        <div>
          <span>快递 满59元包邮</span>
          <van-icon name="arrow"/>
        </div>
      </div>
    </div>
    <footer>
      <div>
        <span>合计:</span>
        <em>￥</em>
        <i>{{balanceOrder.total | money}}</i>
      </div>
      <p @click="openPayTypeDialog">提交订单</p>
    </footer>
    <van-actionsheet v-model="showPayType">
      <p class="payType" v-for="(item,index) in payType"
         @click="onSelect(item.type)">{{item.name}}</p>
      <p class="payType" @click="onSelect(0)">取消</p>
    </van-actionsheet>
  </div>
</template>
<script>
import {Url} from '@/UIConfig/api'
import {mapState} from 'vuex'
import {Toast} from 'vant'
export default {
  name: 'confirmOrder',
  data() {
    return {
      showPayType: false,
      payType: [
        {name: '支付宝', type: 1},
        {name: '微信', type: 2},
        {name: '货到付款', type: 3}
      ],
    }
  },
  computed: {
    ...mapState(['balanceOrder', 'shipAddress'])
  },
  mounted() {
    const _this = this
    if(!_this.balanceOrder.total) {
      _this.$store.dispatch('submitOrder', JSON.parse(localStorage.orderInfo))
    }
    if(_this.$store.state.shipAddress == null) {
      _this.$store.dispatch('initShipAddress')
    }
  },
  methods: {
    openPayTypeDialog() {
      this.showPayType = true;
    },
    onSelect(type) {
      const _this = this;
      const arg = {
        goods: _this.balanceOrder.goods,
        total: _this.balanceOrder.total,
        address: _this.shipAddress._id,
        payType: type
      }
      _this.$http.post(Url.createOrder, arg).then(res => {
        Toast.success(res.data.data)
        _this.showPayType = false;
        _this.$router.replace('/myOrder')
      })
    }
  },
  filters: {
    money(m) {
      return m ? m.toFixed(2) : 0.00
    }
  },
  beforeRouteLeave(to, from, next) {
    localStorage.removeItem('orderInfo')
    next()
  }
}
</script>
<style lang="less" scoped>
.confirmOrder{
  position: relative;
  .content{
    padding-bottom: 50px;
    .address{
      .bottomBg{
        width: 100%;
        height: .4rem;
        background: linear-gradient(to right,#8FC9F4,#fff,#F48D8E,#fff,#8FC9F4);
        background-size: 33% 100%;
      }
      .bottomColor{
        width: 100%;
        height: .4rem;
        background: #f3f3f3;
      }
    }
    .addrInfo{
      display: flex;
      padding: .5rem 0;
      border-bottom: 1px solid #EEEEEE;
      .name{
        flex: 2;
        display: flex;
        justify-content: center;
        align-items: center;
        p{
          width: 2rem;
          height: 2rem;
          line-height: 2rem;
          color: #fff;
          font-size: .8rem;
          text-align: center;
          border-radius: 50%;
          background-color: #B7B8BA;
        }
      }
      .detail{
        flex: 13;
        div{
          display: flex;
          align-items: center;
          line-height: 2rem;
          font-size: .9rem;
          i{
            flex: 1;
            text-align: right;
            margin-left: .8rem;
            color: #a6a6a6;
          }
        }
        p{
          font-size: .8rem;
          em{
            display: inline-block;
            color: #F1642F;
            padding: 0 .5rem;
            background-color: #FFF1E5;
          }
        }
      }
      .edit{
        flex: 2;
        display: flex;
        align-items: center;
        color: #a6a6a6;
        font-size: .8rem;
        margin-left: .2rem;
        p{
          border-left: 1px solid #eeeeee;
          padding: .3em .6rem;
        }
      }
    }
    .goods{
      .goodInfo{
        display: flex;
        height: 4rem;
        align-items: center;
        border-bottom: 1px solid #e2e2e2;
        .imgBox{
          flex:4;
          padding: 0 10px;
          margin: 0 10px;
          img{
            border: 1px solid #E4E7ED;
          }
        }
        .text{
          font-size:0.75rem;
          color:#E46F54;
          flex:14;
          padding-left:10px;
          .control{
            padding-top: 10px;
            display: flex;
            .price{
              flex: 1;
              text-align: left;
            }
            >span{
              flex: 1;
              text-align: right;
              padding-right: 1rem;
            }
          }
        }
      }
    }
    .sendWay{
      display: flex;
      font-size: .8rem;
      line-height: 2rem;
      padding: 0 1rem;
      border-bottom: 1px solid #e2e2e2;
      >div{
        flex:1;
      }
      div:nth-child(2){
        text-align: right;
        span{
          margin-right: .5rem;
        }
      }
    }
  }
  footer{
    position: fixed;
    bottom: 0;
    border-top: 1px solid #e2e2e2;
    display: flex;
    align-items: center;
    width: 100%;
    height: 50px;
    font-size: .9rem;
    >div{
      flex: 3;
      text-align: right;
      padding-right: .5rem;
      em,i{
        color: #EE6123;
      }
      em{
        font-size: .75rem;
      }
    }
    >p{
      flex: 1;
      text-align: center;
      line-height: 50px;
      height: 100%;
      color: #fff;
      background: linear-gradient(to right, #FF8E01 ,#FF5101)
    }
  }
  .payType{
    text-align: center;
    color: #4a4a4a;
    line-height: 2.5rem;
    font-size: .85rem;
    border-top:1px solid #e2e2e2;
  }
  .payType:active{
    background-color: #e8e8e8;
  }
}
</style>
