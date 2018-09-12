<template>
  <div class="searchGoodsList">
    <span v-if="refreshView"></span>
    <van-pull-refresh v-model="isRefresh" @refresh="onRefresh">
      <van-list v-model="loading" :finished="finished" @load="onLoad" :offset="100">
        <div class="goodsBox" v-for="goods in goodsList" :key="goods.ID" 
          @click="goGoodsInfo(goods.ID)">
          <div class="goodsImg">
            <img width="100%" v-lazy="goods.PICTURE_COMPERSS_PATH" :onerror="errImg"/>
          </div>
          <div class="goodsDetail">
            <p>{{goods.NAME}}</p>
            <span>￥<em>{{goods.PRESENT_PRICE}}</em></span>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import {Url} from '@/UIConfig/api'
export default {
  name: 'searchList',
  props: ['word'],
  data() {
    return {
      refreshView: false,
      loading: false,
      finished: false,
      isRefresh: false,
      // no: 1,
      size: 10,
      total: 10,
      goodsList: [],
      lastGoodsID: 'fff9cf2e14e143dc9e49ad75f7bc7bb0'
    }
  },
  methods: {
    goGoodsInfo(id) {
      this.$router.push({name: 'goods', query: {goodsId: id}})
    },
    getGoodsList(w) {
      const _this = this
      if(_this.finished) return
      const query = {
        name: w ? w : _this.word,
        // pageNo: _this.no,
        size: _this.size,
        lastID: _this.lastGoodsID
      }
      _this.$http.post(Url.getSearchGoodsList, query).then(res => {
        _this.loading = false
        // _this.no++
        _this.goodsList = _this.goodsList.concat(res.data.list)
        _this.total = res.data.count
        _this.lastGoodsID = res.data.list.slice(-1)[0].ID;
      }).catch(() => _this.finished = true)
    },
    onLoad() {
      const _this = this
      setTimeout(() => {
        if(_this.goodsList.length >= _this.total) {
          _this.loading = false
          _this.finished = true
        } else {
          _this.getGoodsList()
        }
      }, 500)
    },
    onRefresh() {
      const _this = this
      setTimeout(() => {
        _this.isRefresh = false;
        _this.finished = false;
        _this.goodsList = [];
        _this.no = 1
        _this.onLoad()
      }, 500)
    },
  }
}
</script>
<style lang="less" scoped>
.searchGoodsList{
  padding-bottom: 50px;
  .goodsBox{
    display: flex;
    padding: 5px;
    border-bottom: 1px solid #e5017d;
    .goodsImg{
      flex:1;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 5px;
      img{
        height: 3.5rem;
      }
    }
    .goodsDetail{
      flex:3;
      display: flex;
      flex-direction: column;
      justify-content: center;
      p{
        height: 2rem;
        font-size: .8rem;
      }
      span{
        text-align: right;
        color: #FF6E27;
        padding-right: 10px;
        em{
          font-size: 1rem;
        }
      }
    }
  }
  .am-list-footer{
    padding:5px 0;
  }
}
</style>
