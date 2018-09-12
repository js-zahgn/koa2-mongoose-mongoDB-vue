const path = require("path");
const webpack = require("webpack");
const package = require('../package.json')
module.exports = {
  // 你想要打包的模块
  entry: {
    vendor: Object.keys(package.dependencies)
  },
  output: {
    path: path.join(__dirname, '../static/js'), // 打包后文件输出的位置
    filename: '[name].dll.js',
    library: '[name]_library' 
  },
  plugins: [
    new webpack.DllPlugin({
      //生成上文说到清单文件，此处放在当前build文件下面，你也可以放其他地方
      path: path.join(__dirname, '.', '[name]-manifest.json'), 
      name: '[name]_library'
    }),
   //压缩 只是为了包更小一点 
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console:true,
        drop_debugger:true
      },
      output:{
        // 去掉注释内容
        comments: false,
      },
      sourceMap: true
    })
  ]
};