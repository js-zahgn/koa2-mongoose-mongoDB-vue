const jwt = require('jsonwebtoken');

module.exports = function(uid) {
  const token = jwt.sign({
    user_id: uid
  }, 'laozhang', {
    expiresIn: '2d' // 过期时间设置2天
  });
  return token;
};
