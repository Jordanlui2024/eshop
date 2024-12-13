const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Product = require('../models/product');
const checkAdmin = require('../middleware/auth');

// 設置 multer 存儲配置
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/'); // 確保這裡的路徑正確
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// 顯示添加產品表單
router.get('/add', checkAdmin, (req, res) => {
  res.render('addProductForm');
});

// 處理添加產品表單提交
router.post('/add', checkAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, price, discount, category, description } = req.body;
    const image = req.file ? req.file.filename : '';

    const newProduct = new Product({
      name,
      price,
      discount,
      category,
      image,
      description
    });

    await newProduct.save();
    req.flash('success_msg', 'Product added successfully');
    res.redirect('/');
  } catch (err) {
    console.error('Error adding product:', err);
    req.flash('error_msg', 'Error adding product');
    res.redirect('/products/add');
  }
});

module.exports = router;