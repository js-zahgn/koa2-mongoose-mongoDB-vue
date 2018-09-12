<template>
  <div class="addAddress" :style="{height:hei - 1 + 'px'}">
    <van-nav-bar 
      title="添加收货地址" 
      left-arrow 
      right-text="保存"
      @click-left="$router.go(-1)" 
      @click-right="saveFn"/>
    <ul>
      <li><van-field v-model="user" placeholder="收货人" /></li>
      <li><van-field v-model="mobileNO" type="number" placeholder="手机号码" /></li>
      <li @click="showAreaBox = true">
        <van-field v-model="area" placeholder="所在地区" icon="arrow" disabled/>
      </li>
      <li><van-field v-model="detail" placeholder="详细地址：如道路、门牌号、小区、楼栋号、单元室等" /></li>
    </ul>
    <div class="setDefault"><span>设为默认地址</span><van-switch v-model="isDefault"/></div>
    <div class="deleteBar" v-if="isEdit" @click="deleteAddress(addrId)">
      <span style="color:#F1642F">删除收货地址</span>
    </div>
    <van-actionsheet v-model="showAreaBox">
      <van-area :area-list="areaList" :value="isEdit ? dCode : null"
        @confirm="getTheNewArea" @cancel="showAreaBox = false"/>
    </van-actionsheet>
  </div>
</template>
<script>
import {Url} from '@/UIConfig/api'
import {Toast} from 'vant'
export default {
  name: 'addAddress',
  data() {
    return {
      isEdit: false,
      user: '',
      mobileNO: '',
      province: '',
      pCode: '',
      city: '',
      cCode: '',
      county: '',
      dCode: '',
      detail: '',
      area: '',
      isDefault: false,
      showAreaBox: false,
      hei: '',
      areaList: {},
      addrId: 0,
    }
  },
  mounted() {
    const _this = this
    const doc = document;
    _this.hei = doc.documentElement.clientHeight || doc.body.clientHeight;
    _this.isEdit = _this.$route.query.isEdit || false
    _this.$http.get(Url.getAddressData).then(res => {
      _this.areaList = {
        province_list: res.data.data.province_list,
        city_list: res.data.data.city_list,
        county_list: res.data.data.county_list
      }
    })
    if(_this.isEdit) {
      const theArea = JSON.parse(localStorage.addressInfo)
      _this.province = theArea.province.name;
      _this.pCode = theArea.province.code;
      _this.city = theArea.city.name;
      _this.cCode = theArea.city.code;
      _this.county = theArea.county.name;
      _this.dCode = theArea.county.code;
      _this.area = `${_this.province} ${_this.city} ${_this.county}`;
      _this.detail = theArea.detail;
      _this.user = theArea.user;
      _this.mobileNO = theArea.mobileNO;
      _this.isDefault = theArea.isDefault;
      _this.addrId = theArea._id
    }
  },
  methods: {
    getTheNewArea(arg) {
      this.province = arg[0].name;
      this.pCode = arg[0].code;
      this.city = arg[1].name;
      this.cCode = arg[1].code;
      this.county = arg[2].name;
      this.dCode = arg[2].code;
      this.area = `${this.province} ${this.city} ${this.county}`;
      this.showAreaBox = false
    },
    saveFn() {
      this.isEdit ? this.editAddress() : this.saveAddressData()
    },
    saveAddressData() {
      const _this = this;
      const arg = {
        user: _this.user,
        mobileNO: _this.mobileNO,
        city: {name: _this.city, code: _this.cCode},
        province: {name: _this.province, code: _this.pCode},
        county: {name: _this.county, code: _this.dCode},
        detail: _this.detail,
        isDefault: _this.isDefault
      }
      _this.$http.post(Url.addNewAddress, arg).then(res => {
        Toast.success(res.data.data)
        _this.$router.go(-1)
      })
    },
    editAddress() {
      const _this = this
      const arg = {
        id: _this.addrId,
        user: _this.user,
        mobileNO: _this.mobileNO,
        city: {name: _this.city, code: _this.cCode},
        province: {name: _this.province, code: _this.pCode},
        county: {name: _this.county, code: _this.dCode},
        detail: _this.detail,
        isDefault: _this.isDefault
      }
      _this.$http.post(Url.editAddressInfo, arg).then(res => {
        Toast.success(res.data.data)
        _this.$router.go(-1)
      })
    },
    deleteAddress(id) {
      const _this = this
      _this.$http.post(Url.deleteOneAddress, {id: id, isDefault: _this.isDefault}).then(res => {
        Toast.success(res.data.data)
        _this.$router.go(-1)
      })
    }
  },
  beforeRouteLeave(to, from, next) {
    localStorage.removeItem('addressInfo')
    next()
  }
}
</script>
<style lang="less" scoped>
.addAddress{
  background-color: #F4F4F4;
  li{
    border-bottom: 1px solid #eeeeee;
  }
  .setDefault,.deleteBar{
    background-color: #fff;
    margin-top: 1rem;
    font-size: .8rem;
    height: 2.5rem;
    display: flex;
    align-items: center;
    padding: 0 1rem;
    justify-content: space-between;
  }
  .imgList{
    display: flex;
    li{
      img{
        object-fit: cover;
      }
    }
  }
}
</style>

