<template>
  <div class="addressManage">
    <van-nav-bar 
      title="收货地址" 
      left-arrow 
      right-text="添加"
      @click-left="$router.go(-1)" 
      @click-right="$router.push({name:'addAddress'})"/>
      <p v-if="areaList.length==0">还没有地址信息，请添加新地址</p>
      <ul>
        <li v-for="area in areaList" :key="area._id" @click="setShipAddress(area)">
          <div class="name"><p>{{area.user.length > 2 ? area.user.split('')[0] : area.user}}</p></div>
          <div class="content">
            <div><span>{{area.user}}</span><i>{{area.mobileNO}}</i></div>
            <p>
              <em v-if="area.isDefault == true">默认</em>
              <span>{{area.province.name}}</span>
              <span>{{area.city.name}}</span>
              <span>{{area.county.name}}</span>
              <span>{{area.detail}}</span>
            </p>
          </div>
          <div class="edit">
            <p><em @click.stop="toAddAddr(JSON.stringify(area))">编辑</em></p>
          </div>
        </li>
      </ul>
  </div>
</template>
<script>
import {Url} from '@/UIConfig/api'
export default {
  name: 'addressManage',
  data() {
    return {
      areaList: []
    }
  },
  mounted() {
    localStorage.removeItem('addressInfo')
    const _this = this
    _this.$http.get(Url.getAddressList).then(res => {
      _this.areaList = res.data.data
    })
  },
  methods: {
    toAddAddr(data) {
      this.$router.push({name: 'addAddress', query: {isEdit: true}})
      localStorage.setItem('addressInfo', data)
    },
    setShipAddress(area) {
      if(this.$route.query.radio) {
        this.$store.dispatch('changeShipAddress', area)
        this.$router.replace('/confirmOrder')
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    if(to.name != 'addAddress') {
      localStorage.removeItem('addressInfo')
    }
    next()
  }
}
</script>
<style lang="less" scoped>
.addressManage{
  >p{
    text-align: center;
    line-height: 5rem;
    color: #a6a6a6;
    font-size: .85rem;
  }
  li{
    display: flex;
    padding: .5rem 0;
    border-bottom: 1px solid #EEEEEE;
    .name{
      flex: 3;
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
    .content{
      flex: 13;
      div{
        i{
          font-size: .8rem;
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
      flex: 3;
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
}
</style>

