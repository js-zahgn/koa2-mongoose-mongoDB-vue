<template>
  <div>
    <van-nav-bar title="用户注册" left-arrow @click-left="goBack" />
    <div class="registerPanel" style="padding: 1rem">
      <van-field
        v-model="userName"
        label="用户名"
        icon="clear"
        placeholder="请输入用户名"
        required
        :error-message="userNameErrMsg"
        @click-icon="userName = ''"/>
      <van-field
        v-model="password"
        type="password"
        label="密码"
        placeholder="请输入密码"
        required
        :error-message="pwdErrMsg"/>
      <div class="checkCode">
        <van-field
          v-model="code"
          label="验证码"
          placeholder="请输入验证码"
          required/>
        <span @click="getCode" v-html="verification"></span>
      </div>
      <div class="registerButton">
        <van-button type="primary" :loading="buttonLoading" @click="regForm">注册</van-button>
        <van-button @click="goLogin">马上登录</van-button>
      </div>
    </div>
  </div>
</template>
<script>
import {Toast} from 'vant'
import { Url } from '@/UIConfig/api'
export default {
  name: 'register',
  data() {
    return {
      userName: '',
      password: '',
      buttonLoading: false,
      userNameErrMsg: '',
      pwdErrMsg: '',
      code: '',
      verification: ''
    }
  },
  mounted() {
    this.getCode()
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    goLogin() {
      this.$router.push('/login')
    },
    getCode() {
      const _this = this
      _this.$http.get(Url.getVerificationCode).then(res => {
        _this.verification = res.data.data;
      })
    },
    regForm() {
      const _this = this;
      let passKey = true;
      if(_this.userName.length < 1) {
        _this.userNameErrMsg = '用户名不能为空'
        passKey = false;
        return
      }
      if(_this.password.length < 6) {
        _this.pwdErrMsg = '密码长度不能少于6位'
        passKey = false
        return
      }
      if(passKey) {
        const param = {
          userName: _this.userName,
          password: _this.password,
          code: _this.code
        }
        _this.buttonLoading = true
        _this.$http.post(Url.registerUser, param).then(res => {
          _this.buttonLoading = false;
          if(res.status == 200) {
            localStorage.userName = _this.userName
            _this.userName = ''
            _this.password = ''
            _this.code = ''
            Toast.success(res.data.data)
            _this.$router.replace('/login')
          } else {
            _this.code = ''
            _this.getCode()
          }
        })
      }
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
.checkCode{
  display: flex;
  height: 44px;
  >span{
    margin-right: .5rem;
  }
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
