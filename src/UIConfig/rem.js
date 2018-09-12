const doc = document
// 获取设备宽度
let wrapWidth = doc.documentElement.clientWidth || doc.body.clientWidth

const dom = doc.getElementsByTagName('html')[0]

if (wrapWidth > 750) { wrapWidth = 750 }

// 设置根元素字体尺寸
dom.style.fontSize = wrapWidth / 20 + 'px'

window.addEventListener('resize', function () {
  dom.style.fontSize = wrapWidth / 20 + 'px'
})
