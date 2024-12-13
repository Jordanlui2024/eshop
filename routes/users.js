// var express = require('express');
// var router = express.Router();

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

// module.exports = router;







// 重寫：

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport'); // 新增
const User = require('../models/user');

// 註冊頁面
router.get('/register', (req, res) => res.render('register', { errors: [] }));

// 登入頁面
router.get('/login', (req, res) => res.render('login'));

// 註冊處理
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  // 檢查必填字段
  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  // 檢查密碼匹配
  if (password !== password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  // 檢查密碼長度
  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    // 檢查用戶是否已存在
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });

        // 密碼加密
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save()
              .then(user => {
                req.flash('success_msg', 'You are now registered and can log in');
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

// 登入處理
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/', // 登入成功後重定向到主頁
    failureRedirect: '/users/login', // 登入失敗後重定向到登入頁面
    failureFlash: true // 顯示失敗信息
  })(req, res, next);
});

module.exports = router;