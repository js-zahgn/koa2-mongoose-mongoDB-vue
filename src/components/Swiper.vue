<template>
  <div class="recommendArea">
      <div class="title">商品推荐</div>
      <div class="content">
        <swiper :options="swiperOption">
          <swiper-slide v-for="(item,index) in goodsList" :key="item.goodsId">
            <div class="goodItem">
              <router-link :to="{name: 'goods',query: {goodsId: item.goodsId}}" >
                <img v-lazy="item.image" alt="" width="80%">
                <!-- <div>{{item.goodsName}}</div> -->
                <div>
                  <p>￥{{item.price | formatMoney}}</p>
                  <p>￥{{item.mallPrice | formatMoney}}</p>
                </div>
              </router-link>
            </div>
          </swiper-slide>
          <!-- <div class="swiper-pagination"  slot="pagination"></div> -->
        </swiper>
      </div>
  </div>
</template>
<script>
import 'swiper/dist/css/swiper.css';
import {toMoney} from '@/UIConfig/filters'
import {swiper, swiperSlide} from 'vue-awesome-swiper'
export default {
  name: 'recommend',
  props: ['goodsList'],
  data() {
    return {
      swiperOption: {
        slidesPerView: 3
      }
    }
  },
  components: {
    swiper, swiperSlide
  },
  filters: {
    formatMoney (money) {
      return toMoney(money)
    }
  }
}
</script>

<style scoped lang="less">
.recommendArea{
  background-color: #fff;
  .title{
    border-bottom: 1px solid #eee;
    font-size:14px;
    padding:.2rem;
    color:#e5017d;
  }
  .content{
    border-bottom: 1px solid #eee;
    .goodItem{
      width:99%;
      border-right:1px solid #eee;
      font-size : 12px;
      text-align: center;
      p{
        margin: 0;
      }
      p+p{
        text-decoration: line-through;
        color: #aaa;
      }
    }
  }
}
</style>