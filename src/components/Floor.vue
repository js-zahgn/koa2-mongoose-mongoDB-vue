<template>
  <div class="floor">
    <div class="title"> <span>{{index}}F</span>{{title}} </div>
      <div class="floorAnomaly">
        <div class="floorOne">
          <router-link :to="{name:'goods',query:{goodsId:floor1_1.goodsId}}" >
            <img :src="floor1_1.image" width="100%" :onerror="errImg">
          </router-link>
        </div>
        <div>
          <div class="floorTwo">
            <router-link :to="{name:'goods',query:{goodsId:floor1_2.goodsId}}" >
              <img :src="floor1_2.image" width="100%" :onerror="errImg">
            </router-link>
          </div>
          <div class="floorThree">
            <router-link :to="{name:'goods',query:{goodsId:floor1_3.goodsId}}" >
              <img :src="floor1_3.image" width="100%" :onerror="errImg">
            </router-link>
          </div>
        </div>
      </div>
      <div class="floorRule">
        <div v-for="(item,index) in dataList.slice(3)" :key="item.goodsId">
           <router-link :to="{name:'goods',query:{goodsId:item.goodsId}}" >
              <img :src="item.image" width="100%" :onerror="errImg">
            </router-link>
        </div>
      </div>
    </div>
</template>
<script>
export default {
  name: 'floor',
  props: ['dataList', "title", "index"],
  data() {
    return {
      floor1_1: {},
      floor1_2: {},
      floor1_3: {}
    }
  },
  watch: {
    dataList(val) {
      this.floor1_1 = this.dataList[0];
      this.floor1_2 = this.dataList[1];
      this.floor1_3 = this.dataList[2]
    }
  }
}
</script>
<style lang="less" scoped>
@border: 1px solid #ddd;
  .title{
    text-align: center;
    font-size: 14px;
    height: 1.8rem;
    line-height: 1.8rem;
    border-bottom: @border;
    background-color: #f5f5f5;
    color:#E46F54;
    span{
      display: inline-block;
      background-color:#E46F54; 
      color:#fff;
      width: 1.2rem;
      height: 1.2rem;
      line-height: 1.3rem;
      border-radius: 50%;
      margin-right: 10px;
    }
  }
  .floorAnomaly{
    display: flex;
    flex-direction: row;
    background-color: #fff;
    border-bottom: @border;
    >div{
      width:10rem;
      box-sizing: border-box;
    }
    .floorOne{
      border-right: @border;
    }
    .floorTwo{
      border-bottom: @border;
    }
    
  }
  .floorRule{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    background-color: #fff;
    >div{
      box-sizing: border-box;
      width: 10rem;
      border-bottom: @border;
    }
    >div:nth-child(odd){
      border-right: @border;
    }
  }
</style>

