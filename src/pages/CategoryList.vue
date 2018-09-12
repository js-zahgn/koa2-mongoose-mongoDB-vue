<template>
  <div>
    <div class="navBarBox">
      <van-nav-bar title="类别列表"/>
    </div>
    <ul class="headBar">
      <li v-for="(item,index) in category" :key="`category->${index}`"
          @click="changeActiveIndex(item.ID)"
          :class="{active:activeIndex == item.ID}">
        <img v-lazy="item.IMAGE" width="60%">
        <span>{{item.MALL_CATEGORY_NAME}}</span>
      </li>
    </ul>
    <van-row>
        <van-col span="6">
          <div class="leftNav" ref="leftNav">
            <ul>
              <li v-for="(cate,index) in categorySub" :key="`categorySub->${index}`"
                :class="{active:activeCategorySubId == cate.ID}"
                @click="changeCategorySubList(cate.ID)">
                <span>{{cate.MALL_SUB_NAME}}</span>
              </li>
            </ul>
          </div>
        </van-col>
        <van-col span="18">
          <div class="goodsContent" ref="goodsContent">
            <van-pull-refresh v-model="isRefresh" @refresh="onRefresh">
              <van-list
                v-model="loading"
                :finished="finished"
                @load="onLoad">
                  <div class="goodInfo" v-for="(goods,index) in goodList" :key="goods.ID"
                      @click="goGoodsInfo(goods.ID)">
                    <div class="goodImg">
                      <img :src="goods.IMAGE1" width="90%" :onerror="errImg">
                    </div>
                    <div class="goodName">
                      <span>{{goods.NAME}}</span>
                      <div>
                        <span>￥{{goods.ORI_PRICE}}</span>
                        ￥{{goods.PRESENT_PRICE}}
                      </div>
                    </div>
                  </div>
              </van-list>
            </van-pull-refresh>
          </div>
        </van-col>
    </van-row>
    <PublicFooter :activeItem="1"/>
  </div>
</template>
<script>
import {Url} from '@/UIConfig/api.js'
import PublicFooter from '@/components/PublicFooter'
import GoodInfo from '@/components/GoodInfo'
import {Toast} from 'vant'
export default {
  name: 'categoryList',
  data() {
    return {
      activeIndex: 1,
      activeCategorySubId: 1,
      category: [],
      categorySub: [],
      goodList: [],
      loading: false, // 上拉加载开关
      finished: false, // 上拉拉加载是否没有数据了
      isRefresh: false, // 下拉开关
      pageSize: 10,
      pageNo: 1,
      total: 10,
    }
  },
  components: {
    PublicFooter, GoodInfo
  },
  created() {
    const _this = this
    _this.getDataList()
  },
  mounted() {
    const _this = this
    _this.getCategorySubList(_this.$route.params.categoryId || _this.activeIndex)
    if (_this.$route.params.categoryId) {
      _this.activeIndex = _this.$route.params.categoryId
    }

    const winHeight = document.documentElement.clientHeight
    _this.$refs.leftNav.style.height = winHeight - 180 + 'px'
    _this.$refs.goodsContent.style.height = winHeight - 180 + 'px'
  },
  methods: {
    getDataList() {
      const _this = this;
      _this.$http.get(Url.getCategoryList).then(res => {
        if (res.status == 200 && res.data.data) {
          _this.category = res.data.data
        } else {
          Toast('服务器错误，获取数据失败')
        }
      })
    },
    // 点击父类
    changeActiveIndex(id) {
      const _this = this
      _this.activeIndex = id
      _this.pageNo = 1
      _this.finished = false
      _this.goodList = []
      const param = {categoryId: id}
      _this.$http.post(Url.getCategorySub, param).then(res => {
        if (res.status == 200 && res.data.data) {
          _this.categorySub = res.data.data;
          _this.activeCategorySubId = res.data.data[0].ID
          _this.getGoodsBySubId(res.data.data[0].ID)
        } else {
          Toast('服务器错误，获取数据失败')
        }
      })
    },
    getCategorySubList(id) {
      const _this = this
      const param = {categoryId: id ? id : _this.activeIndex}
      _this.$http.post(Url.getCategorySub, param).then(res => {
        if (res.status == 200 && res.data.data) {
          _this.categorySub = res.data.data;
          _this.activeCategorySubId = res.data.data[0].ID
        } else {
          Toast('服务器错误，获取数据失败')
        }
      })
    },
    // 点击子类
    changeCategorySubList(id) {
      this.activeCategorySubId = id
      this.goodList = []
      this.finished = false
      this.pageNo = 1
      this.onLoad()
    },
    // 通过小类获取商品
    getGoodsBySubId(id) {
      const _this = this
      const param = {
        categorySubId: id ? id : _this.activeCategorySubId,
        pageSize: _this.pageSize,
        pageNo: _this.pageNo
      }
      _this.$http.post(Url.getGoodsByCategorySubId, param).then(res => {
        if(res.status == 200) {
          _this.pageNo++
          _this.goodList = _this.goodList.concat(res.data.data.list)
          _this.total = res.data.data.count
        } else {
          _this.finished = true
          Toast.fail('获取数据出错')
        }
        _this.loading = false
      })
    },
    onLoad() {
      const _this = this
      setTimeout(() => {
        _this.activeCategorySubId =
        _this.activeCategorySubId ? _this.activeCategorySubId : _this.categorySub[0].ID
        if(_this.goodList.length >= _this.total) {
          _this.loading = false
          _this.finished = true
        } else {
          _this.getGoodsBySubId()
        }
      }, 1000)
    },
    onRefresh() {
      const _this = this
      setTimeout(() => {
        _this.isRefresh = false;
        _this.finished = false;
        _this.goodList = [];
        _this.pageNo = 1
        _this.onLoad()
      }, 500)
    },
    goGoodsInfo(id) {
      this.$router.push({name: 'goods', query: {goodsId: id}})
    }
  }
}
</script>

<style lang="less" scoped>
.headBar{
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
  li{
    box-sizing: border-box; 
    flex: 1;
    text-align: center;
    border-bottom: 1px solid #E4E7ED;
    span{
      display: inline-block;
      line-height: 1.5rem;
      font-size: .7rem;
    }
    img{
      margin-top: .3rem;
    }
  }
  li.active{
    border-bottom: 2px solid #e5017d;
  }
}
.leftNav {
  overflow-y: auto;
  ul li {
    line-height: 2rem;
    border-bottom:1px solid #E4E7ED;
    padding:3px;
    font-size:0.8rem;
    text-align: left;
    padding-left: 10px;
  }
  .active{
    background-color: #f0f0f0
  }
}
.goodsContent{
  overflow: scroll; 
  .goodInfo{
    display: flex;
    flex-direction: row;
    font-size: .8rem;
    padding: 5px;
    border-bottom: 1px solid #f0f0f0;
    background-color: #fff;
    .goodImg{
      flex:8;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .goodName{
      flex: 16;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 .3rem;
      div{
        color: #e5017d;
        text-align: right;
        span{
          color: #aaa;
          text-decoration: line-through;
        }
      }
    }
  }
}
  
</style>
