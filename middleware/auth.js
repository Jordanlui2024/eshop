// middleware/auth.js
function checkAdmin(req, res, next) {
    // 假設用戶信息存儲在 req.user 中
    if (req.user && req.user.isAdmin) {
      return next();
    }
    res.status(403).send('Access denied');
  }
  
  module.exports = checkAdmin;