// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import 'babel-polyfill'
import './UIConfig/rem'
import Vue from 'vue'
import App from './App'
import router from './UIConfig/router'
import './UIConfig/vant'
import { Http } from './UIConfig/api'
import store from './UIConfig/store'
import './assets/reset.css'

Vue.prototype.$http = Http
Vue.prototype.errImg = `this.src="${require('@/assets/userInfo.png')}"`

Vue.config.productionTip = false

const vm = new Vue({
  el: '#app',
  router,
  store,
  // components: { App },
  // template: '<App/>',
  render: h => h(App),
  mounted() {
    document.dispatchEvent(new Event('render-event'))
  }
})

export default vm
