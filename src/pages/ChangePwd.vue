<template>
  <div>
    <van-nav-bar title="修改密码" left-arrow @click-left="$router.go(-1)"/>
    <div class="content" style="padding:2rem 1rem">
      <van-field
        v-model="password"
        type="text"
        label="密码"
        placeholder="请输入新密码"
        error-message="请输入至少6位字符"
        required/>
      <van-button @click="change" plain type="danger" size="large">确定</van-button>
    </div>
  </div>
</template>
<script>
import { Url } from '@/UIConfig/api'
export default {
  name: 'changePwd',
  data() {
    return {
      password: ''
    }
  },
  methods: {
    change() {
      const _this = this
      const param = {
        name: localStorage.userName,
        newPwd: _this.password
      }
      _this.$http.post(Url.changePassword, param).then(res => {
        if(res.status == 200) {
          _this.$router.push('/login')
        }
      })
    }
  }
}
</script>

