<template>
  <div>
    <van-nav-bar title="用户登录" left-arrow @click-left="$router.go(-1)" />
    <div class="registerPanel" style="padding: 1rem">
      <van-field
        v-model="userName"
        label="用户名"
        icon="clear"
        placeholder="请输入用户名"
        required
        @click-icon="userName = ''"/>
      <van-field
        v-model="password"
        type="password"
        label="密码"
        placeholder="请输入密码"
        required/>
      <div class="registerButton">
        <van-button type="primary" :loading="buttonLoading" @click='login'>登录</van-button>
        <van-button @click="$router.push('/register')">马上注册</van-button>
      </div>
    </div>
  </div>
</template>
<script>
import {Toast} from 'vant'
import { Url } from '@/UIConfig/api'
export default {
  name: 'login',
  data() {
    return {
      userName: '',
      password: '',
      buttonLoading: false,
    }
  },
  mounted() {
    if(localStorage.getItem('userName')) {
      this.userName = localStorage.getItem('userName')
    }
  },
  methods: {
    login() {
      const _this = this
      const param = {
        name: _this.userName,
        password: _this.password,
      }
      _this.buttonLoading = true
      _this.$http.post(Url.login, param).then(res => {
        if(res.data.data) {
          localStorage.setItem('userName', _this.userName)
          localStorage.setItem('token', res.data.token)
          Toast.success(`登录成功`)
          _this.$router.push('/')
        } else {
          Toast.fail(`登录失败!</br>${res.data.data}`)
        }
        _this.buttonLoading = false;
      })
    }
  }
}
</script>
<style lang="less" scoped>
.registerPanel{
  border-radius:5px;
  margin:20px auto;
  padding-bottom: 50px;
}
.registerButton{
  padding-top:10px;
  display: flex;
  >button{
    margin: 1rem .5rem;
    flex:1
  }
}
</style>
