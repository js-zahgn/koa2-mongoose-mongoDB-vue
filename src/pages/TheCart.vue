<template>
  <div class="shoppingCart">
    <div class="navBarBox">
      <van-nav-bar title="购物车"
                  left-text="返回"
                  left-arrow
                  @click-left="$router.go(-1)"/>
    </div>
    <div class="goodsList">
      <div v-if="cartInfo.length > 0">
        <div class="goodsItem" v-for="(goods, index) in cartInfo" :key="goods.Id" data-type="0">
          <van-swipe-cell :right-width="40">
            <div class="goodsBox">
              <div class="content">
                <van-checkbox shape="square" v-model="goods.select" 
                      @change="filterGoodsList"></van-checkbox>
                <div class="imgBox" @click="$router.push({name:'goods',query:{goodsId:goods.Id}})">
                  <img :src="goods.Image" width="100%" :onerror="errImg">
                </div>
                <div class="text">
                  <div>{{goods.Name}}</div>
                  <div class="control">
                    <div class="price">￥{{goods.Price | toMoney}}</div>
                    <van-stepper v-model="goods.Count" :integer="true" 
                                @change="changeGoodsCount(goods.Count,goods.Id)"/>
                  </div>
                </div>
              </div>
            </div>
            <div class="delete" @click="deleteGoods(goods.Id)" :data-index="index" slot="right">删除</div>
          </van-swipe-cell>
        </div>           
      </div>
      <h1 v-else style="text-align: center;color:#ccc;padding:1rem">暂无商品</h1>
    </div>
    <div class="totalBar">
      <van-checkbox shape="square" v-model="selectAll" @change="isSelectAll">全选</van-checkbox>
      <div class="text">
        <div class="money">合计：￥{{totalMoney | toMoney}}</div>
        <div>配送费:3元 (满59.00免配送费)</div>
      </div>
    </div>
    <div class="cartBtn">
      <van-button size="small" type="danger" plain 
      @click="clear">清空购物车</van-button>
      <van-button size="small" type="danger" plain 
      @click="balance"
      :disabled="selectedList.length == 0">结算</van-button>
    </div>
    <Footer :activeItem="2"/>
  </div>
</template>
<script>
import Footer from '../components/PublicFooter'
import { Url } from '../UIConfig/api'
import { toMoney } from '../UIConfig/filters'
import { Toast } from 'vant'
export default {
  name: 'theCart',
  data() {
    return {
      cartInfo: [],
      selectedList: [],
      selectAll: false,
    }
  },
  computed: {
    totalMoney() {
      const _this = this;
      let count = 0;
      _this.selectedList.forEach(goods => count += goods.Count * goods.Price)
      return _this.selectedList.length > 0 && count < 59 ? count + 3 : count
    }
  },
  created() {
    const _this = this;
    _this.$http.get(Url.getCartInfoByUserId).then(res => {
      _this.cartInfo = res.data.data.map(item => {
        return {
          ...item,
          select: false
        }
      })
    })
  },
  components: {
    Footer
  },
  methods: {
    filterGoodsList() {
      const _this = this;
      _this.selectedList = _this.cartInfo.filter(goods => goods.select);
      _this.selectAll = _this.selectedList.length == _this.cartInfo.length;
    },
    isSelectAll(val) {
      const _this = this;
      _this.selectAll = val;
      _this.cartInfo.forEach(goods => goods.select = val)
      _this.selectedList = val ? _this.cartInfo : [];
    },
    changeGoodsCount(...arg) {
      const _this = this;
      const param = {
        goodsId: arg[1],
        count: Number(arg[0])
      }
      _this.$http.post(Url.changeCartGoodsCount, param)
    },
    deleteGoods(id) {
      const _this = this;
      const param = {
        goodsId: id
      }
      _this.$http.post(Url.deleteGoodsFromCart, param).then(res => {
        _this.cartInfo.splice(_this.cartInfo.findIndex(e => e.Id == id), 1)
      })
    },
    clear() {
      const _this = this;
      _this.$http.post(Url.clearCartGoods, {}).then(res => {
        if(res.status == 200) {
          _this.cartInfo = []
        } else {
          Toast.warning('未清除成功')
        }
      })
    },
    balance() {
      const _this = this;
      const param = {
        total: _this.totalMoney,
        goods: _this.selectedList
      }
      localStorage.setItem('orderInfo', JSON.stringify(param))
      _this.$store.dispatch('submitOrder', param)
      _this.$router.push('/confirmOrder')
    }
  },
  filters: {
    toMoney(val) {
      return toMoney(val)
    },
  }
}
</script>
<style lang="less" scoped>
.shoppingCart{
  overflow: hidden;
  .goodsList{
    border-bottom:1px solid #E4E7ED;
    background-color: #fff;
    .goodsItem{
      transition: all .065s ease-out;
      .goodsBox{
        display: flex;
        flex-direction: row;
        flex-wrap:nowrap;
        padding:.3rem .5rem .2rem ;
        border-bottom:1px solid #E4E7ED;
        .content{
          flex: 1;
          display: flex;
          overflow: hidden;
          .van-checkbox__icon--checked{
          .van-icon{
              border-color: #F54F4A;
              background-color: #F54F4A;
            }
          }
          .imgBox{
            flex:6;
            padding: 0 10px;
            margin: 0 10px;
            img{
              border: 1px solid #E4E7ED;
            }
          }
          .control{
            padding-top: 10px;
            display: flex;
            .price{
              flex: 4;
              text-align: left;
            }
            .van-stepper{
              display: flex;
              .van-stepper__minus,.van-stepper__plus{
                border-radius: 50%;
                width: 20px;
                height: 20px;
              }
              input{
                border: 0;
                outline: none;
              }
            }
          }
          .text{
            font-size:0.75rem;
            color:#E46F54;
            flex:14;
            padding-left:10px;
          }
        }
      }
       .delete {
        width: 40px;
        height: 5.2rem;
        background: #E46F54;
        font-size: .75rem;
        color: #fff;
        text-align: center;
        line-height: 5.2rem;
      }
    }
  }
  .totalBar{
    display: flex;
    font-size: .75rem;
    padding: 10px;
    background-color: #fff;
    .text{
      margin-left: 10px;
      .money{
        color:#E46F54;
      }
    }
  }
  .cartBtn{
    padding: 10px;
    text-align: right;
  }
}

</style>
