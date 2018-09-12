export const toMoney = (m) => m ? m.toFixed(2) : 0.00;

// Tools
// 获取日期00:00:00点时间戳
export const getMoment = (d) => {
  const dd = new Date(d)
  return new Date(dd.getFullYear(), dd.getMonth(), dd.getDate(), 0, 0, 0).getTime()
}
