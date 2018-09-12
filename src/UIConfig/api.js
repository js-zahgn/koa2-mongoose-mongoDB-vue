import axios from 'axios'
import { Toast } from 'vant'
import router from './router'

export const Url = {
  getBaseData: '/base/getBaseData',
  login: '/user/login',
  registerUser: '/user/register',
  getUserInfo: '/user/getUserInfo',
  uploadUserImg: '/user/uploadUserImg',
  changePassword: '/user/changePassword',
  getVerificationCode: '/user/getVerificationCode',
  signInAction: '/sign/signInAction',
  getUserSignInfo: '/sign/getUserSignInfo',
  clearSignInfo: '/sign/clearSignInfo',
  addNewAddress: '/address/addNewAddress',
  getAddressList: '/address/getAddressList',
  getAddressData: '/address/getAddressData',
  editAddressInfo: '/address/editAddressInfo',
  deleteOneAddress: '/address/deleteOneAddress',
  getDefaultAddress: '/address/getDefaultAddress',
  getDetailGoodsInfo: '/goods/getDetailGoodsInfo',
  getCategoryList: '/goods/getCategoryList',
  getCategorySub: '/goods/getCategorySub',
  getGoodsByCategorySubId: '/goods/getGoodsListByCategorySubID',
  getGoodsListByName: '/goods/getGoodsListByName',
  getSearchGoodsList: '/goods/getSearchGoodsList',
  getCartInfoByUserId: '/cart/getCartInfoById',
  addGoodsToCart: '/cart/addGoodsToCart',
  changeCartGoodsCount: '/cart/changeCartGoodsCount',
  clearCartGoods: '/cart/clearCartGoods',
  deleteGoodsFromCart: '/cart/deleteGoodsFromCart',
  getUserOrderCount: '/order/getUserOrderCount',
  getUserOrderList: '/order/getUserOrderList',
  createOrder: '/order/createOrder',
  deleteOrder: '/order/deleteOrder'
}

axios.defaults.timeout = 5000;
axios.interceptors.request.use(config => {
  config.headers.common['X-Requested-With'] = 'XMLHttpRequest';
  config.url = process.env.BASE_URL + config.url

  if (localStorage.token) {
    config.headers.Authorization = localStorage.token
    config.headers.UserName = localStorage.userName
  } else {
    localStorage.removeItem('userName')
  }
  return config
}, err => {
  return Promise.reject(err)
});

axios.interceptors.response.use(data => {
  return data
}, err => {
  console.log(err)
  switch (err.response.status) {
    case 500:
      Toast(err.response.data.data ? err.response.data.data : '服务器出问题了')
      break;
    case 400:
    case 401:
      Toast('请重新登录！')
      localStorage.removeItem('token')
      router.replace({path: '/login'})
      break;
    case 408:
      Toast('验证码过期，请重新获取')
      break;
    default:
      Toast('网络出错，请稍后重试');
      break;
  }
});

export const Http = axios;
