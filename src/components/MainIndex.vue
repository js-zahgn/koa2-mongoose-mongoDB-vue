<template>
  <div>
    <div class="swiperArea">
      <van-swipe :autoplay="4000">
        <van-swipe-item v-for="(pic,index) in bannerPicList" :key="pic.goodsId">
          <router-link :to="{name:'goods',query:{goodsId:pic.goodsId}}">
            <img v-lazy="pic.image" width="100%">
          </router-link>
        </van-swipe-item>
      </van-swipe>
    </div>
    <div class="typeBar">
      <div v-for="(cate,index) in category" :key="cate.mallCategoryId">
        <router-link :to="{name:'categoryList',query:{categoryId:cate.mallCategoryId}}">
          <img v-lazy="cate.image" width="90%">
          <span>{{cate.mallCategoryName}}</span>
        </router-link>
      </div>
    </div>
    <div class="adBanner">
      <img v-lazy="adBanner.PICTURE_ADDRESS" width="100%">
    </div>
    <Swiper :goodsList="recommendGoods"/>
    <Floor :dataList="floor1" :title="floorTitle.floor1" index="1"/>
    <Floor :dataList="floor2" :title="floorTitle.floor2" index="2"/>
    <Floor :dataList="floor3" :title="floorTitle.floor3" index="3"/>
    <HotList :dataList="hotList"/>
  </div>
</template>
<script>
import Swiper from '@/components/Swiper'
import Floor from '@/components/Floor'
import HotList from '@/components/HotList'
import {Url} from '@/UIConfig/api'
export default {
  name: 'mainIndex',
  data() {
    return {
      bannerPicList: [],
      category: [],
      adBanner: [],
      recommendGoods: [],
      floor1: [],
      floor2: [],
      floor3: [],
      floorTitle: {},
      hotList: []
    }
  },
  components: {
    Swiper, Floor, HotList
  },
  created() {
    this.init()
  },
  methods: {
    init () {
      const _this = this
      _this.$http.get(Url.getBaseData).then(res => {
        console.log(res)
        _this.bannerPicList = res.data.data.slides;
        _this.category = res.data.data.category;
        _this.adBanner = res.data.data.advertesPicture;
        _this.recommendGoods = res.data.data.recommend;
        _this.floor1 = res.data.data.floor1;
        _this.floor2 = res.data.data.floor2;
        _this.floor3 = res.data.data.floor3;
        _this.floorTitle = res.data.data.floorName;
        _this.hotList = res.data.data.hotGoods;
      })
    },
  }
}
</script>
<style scoped lang="less">
@border: 1px solid #ddd;
  .swiperArea{
    width:100%;
    clear:both;
    overflow: hidden;
    img{
      height: 9rem;
    }
  }
  .typeBar{
    background-color: #fff;
    margin:0 .3rem .3rem .3rem;
    border-radius: .3rem;
    font-size: 14px;
    display: flex;
    flex-direction: row;
    flex-wrap:nowrap;
    div{
      flex: 1;
      padding: .3rem;
      font-size: 12px;
      text-align: center;
    }
  } 

</style>