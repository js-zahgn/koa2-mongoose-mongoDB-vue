import Vue from 'vue'

import {
  Button, Row, Col,
  Swipe, SwipeItem,
  Lazyload, List, Field,
  NavBar, Tabs, Tab,
  Tabbar, TabbarItem, Switch,
  GoodsAction, GoodsActionBigBtn, GoodsActionMiniBtn,
  Icon, PullRefresh, Area, Actionsheet,
  Checkbox, Stepper, SwipeCell } from 'vant'

Vue.use(Button).use(Row).use(Col)
  .use(Swipe).use(SwipeItem)
  .use(Lazyload).use(List)
  .use(Field).use(NavBar)
  .use(GoodsAction).use(GoodsActionBigBtn).use(GoodsActionMiniBtn)
  .use(Tabs).use(Tab).use(Area).use(Actionsheet)
  .use(Tabbar).use(TabbarItem).use(Switch)
  .use(Icon).use(PullRefresh)
  .use(Checkbox).use(Stepper).use(SwipeCell)
