<template>
  <div class="layout">
    <div class="searchBar">
      <div class="iconBox">
        <van-icon name="arrow-left" v-if="showSearchPage" @click="backMain"/>
        <van-icon name="location" v-else/>
      </div>
      <div class="inputBox">
        <input type="text" placeholder="请输入商品关键字" v-model="searchWord"/>
      </div>
      <div class="iconBox">
        <van-icon name="search" @click="goSearchGoods"/>
      </div>
    </div>
    <SearchList v-if="showSearchPage" :word="searchWord" ref="searchList"/>
    <keep-alive v-if="!showSearchPage">
      <MainIndex/>
    </keep-alive>
    <PublicFooter :activeItem="0"/>
  </div>
</template>
<script>
import MainIndex from '@/components/MainIndex'
import SearchList from '@/components/MainSearchList'
import PublicFooter from '@/components/PublicFooter'
export default {
  name: 'layout',
  data () {
    return {
      showSearchPage: false,
      searchWord: ''
    }
  },
  components: {
    MainIndex, SearchList, PublicFooter
  },
  mounted() {
    if(localStorage.showSearchPage == 'true') {
      this.showSearchPage = true
      this.searchWord = localStorage.searchWord
    }
  },
  methods: {
    backMain() {
      localStorage.setItem('showSearchPage', false)
      localStorage.removeItem('searchWord')
      this.showSearchPage = false
    },
    refreshSearchGoods() {
      const _this = this
      _this.$refs.searchList.no = 1
      _this.$refs.searchList.goodsList = []
      _this.$refs.searchList.finished = false
      _this.$refs.searchList.getGoodsList(_this.searchWord)
    },
    goSearchGoods() {
      const _this = this
      if(_this.showSearchPage) {
        localStorage.setItem('searchWord', _this.searchWord)
        _this.refreshSearchGoods()
      } else {
        if(_this.searchWord != '') {
          localStorage.setItem('searchWord', _this.searchWord)
          localStorage.setItem('showSearchPage', true)
          _this.showSearchPage = true
        }
      }
    },
  },
  beforeRouteLeave (to, from, next) {
    localStorage.removeItem('searchWord')
    localStorage.removeItem('showSearchPage')
    next()
  }
}
</script>
<style scoped lang="less">
.layout{
  max-width: 100vw;
  overflow: hidden;
  .searchBar{
    height: 2.2rem;
    background-color: #e5017d;
    display: flex;
    .iconBox{
      flex:1;
      color: #fff;
      font-size: 1.2rem;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .inputBox{
      flex:4;
      padding-top: .25rem;
    }
    input{
      width:100%;
      height: 1.3rem;
      border-top:0px;
      border-left:0px;
      border-right:0px;
      border-bottom: 2px solid;
      background-color: #e5017d;
      color:#fff;
      margin-top: 4px;
    }
    input::-webkit-input-placeholder{
      color:rgba(255,255,255,.5);
    }
    input::-moz-placeholder{   /* Mozilla Firefox 19+ */
      color:rgba(255,255,255,.5);
    }
    input:-ms-input-placeholder{  /* Internet Explorer 10-11 */ 
      color:rgba(255,255,255,.5);
    }
  }
}
</style>
