<template>
  <div class="hotArea">
    <div class="title">
      热卖商品
    </div>
    <div class="hotGoods">
      <van-list>
        <van-row :gutter="20">
          <van-col :span="12" v-for="(item,index) in dataList" :key="item.goodsId">
            <GoodInfo 
            :goodName="item.name"
            :goodImage="item.image"
            :goodPrice="item.price"
            :goodId="item.goodsId"/>
          </van-col>
        </van-row>
      </van-list>
    </div>
  </div>
</template>
<script>
import GoodInfo from './GoodInfo'
export default {
  name: 'hotList',
  props: ['dataList'],
  components: {
    GoodInfo
  }
}
</script>
<style lang="less" scoped>
  .hotArea{
    padding-bottom: 50px;
    text-align: center;
    font-size: 14px;
    line-height: 1.8rem;
  }
</style>

