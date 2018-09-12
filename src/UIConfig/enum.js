// 订单状态
export const OrderType = {
  notPay: 1, // 待付款
  notDispatch: 2, // 待配送
  notArrive: 3, // 待签收
  notEvaluate: 4 // 待评价
}

// 订单支付方式
export const PayType = {
  notPay: 0, // 未支付
  aliPay: 1, // 支付宝
  wxPay: 2, // 微信支付
  COD: 3 // 货到付款
}
