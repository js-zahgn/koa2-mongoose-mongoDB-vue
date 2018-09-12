<template>
  <div class="goodInfo">
    <router-link :to="{name:'goods',query:{goodsId:goodId}}" >
      <div class="goodImg">
        <img v-lazy="goodImage" width="90%" >
      </div>
      <div class="goodName">{{goodName}}</div>
      <div class="goodPrice">￥{{goodPrice}}</div>
    </router-link>
  </div>
</template>
<script>
import {toMoney} from '@/UIConfig/filters'
export default {
  name: 'goodInfo',
  props: ['goodImage', 'goodName', 'goodPrice', 'goodId'],
  filters: {
    formatMoney(m) {
      return toMoney(m)
    }
  }
}
</script>
<style scoped>
.goodInfo{
  line-height: 1rem;
}
.goodName{
  padding: 0 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space:nowrap; 
}
</style>