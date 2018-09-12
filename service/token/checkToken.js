const jwt = require('jsonwebtoken');
//检查token是否过期
module.exports = async (ctx, next) => {
  // 拿到token
  if(ctx.request.header['authorization']) {
    let token = ctx.request.header['authorization'];
    let decoded = jwt.decode(token, 'laozhang');
    if(token && decoded.exp <= new Date() / 1000) {
      ctx.status = 401;
      ctx.body = {
        data: 'token过期'
      };
    }else{
      return next();
    }
  }else{
    ctx.status = 401;
    ctx.body = {
      data: '没有token'
    }
  }
};
