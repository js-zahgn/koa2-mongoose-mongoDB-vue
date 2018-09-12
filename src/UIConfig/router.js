import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

const Main = () => import(/* webpackChunkName:'Main' */ '@/pages/Main')
// const MainIndex = () => import(/* webpackChunkName:'MainIndex' */ '@/components/MainIndex')
// const MainSearchList = () => import(/* webpackChunkName:'MainSearchList' */ '@/components/MainSearchList')

const TheCart = () => import(/* webpackChunkName:'TheCart' */ '@/pages/TheCart')
const Goods = () => import(/* webpackChunkName:'Goods' */ '@/pages/Goods')
const CategoryList = () => import(/* webpackChunkName:'CategoryList' */ '@/pages/CategoryList')

const MyInfo = () => import(/* webpackChunkName:'MyInfo' */ '@/pages/MyInfo')
const Register = () => import(/* webpackChunkName:'Register' */ '@/pages/Register')
const ChangePwd = () => import(/* webpackChunkName:'ChangePwd' */ '@/pages/ChangePwd')
const Login = () => import(/* webpackChunkName:'Login' */ '@/pages/Login')
const Address = () => import(/* webpackChunkName:'Address' */ '@/pages/Address')
const AddAddress = () => import(/* webpackChunkName:'AddAddress' */ '@/pages/AddAddress')

const ConfirmOrder = () => import(/* webpackChunkName:'ConfirmOrder' */ '@/pages/ConfirmOrder')

const MyOrder = () => import(/* webpackChunkName:'MyOrder' */ '@/pages/MyOrder')

const routes = [
  {
    path: '*', redirect: 'main'
  },
  {
    path: '/main',
    component: Main,
    // children: [
    //   {
    //     path: '/',
    //     name: 'index',
    //     component: MainIndex
    //   },
    //   {
    //     path: '/searchList',
    //     name: 'searchList',
    //     component: MainSearchList,
    //   }
    // ]
  },
  {
    path: '/theCart',
    name: 'theCart',
    component: TheCart
  },
  {
    path: '/confirmOrder',
    name: 'confirmOrder',
    component: ConfirmOrder
  },
  {
    path: '/myOrder',
    name: 'myOrder',
    component: MyOrder
  },
  {
    path: '/myInfo',
    name: 'myInfo',
    component: MyInfo
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '/changePwd',
    name: 'changePwd',
    component: ChangePwd
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/address',
    name: 'addressManage',
    component: Address
  },
  {
    path: '/addAddress',
    name: 'addAddress',
    component: AddAddress
  },
  {
    path: '/goods',
    name: 'goods',
    component: Goods
  },
  {
    path: '/categoryList',
    name: 'categoryList',
    component: CategoryList
  }
]

export default new Router({
  mode: 'history',
  routes: routes
})
