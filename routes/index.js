const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Order = require('../models/order');
const checkAdmin = require('../middleware/auth');

// 首頁
router.get('/', async (req, res) => {
  const itemName = req.query.item_name || '';
  const page = parseInt(req.query.page) || 1;
  const limit = 2; // 每頁顯示的產品數量
  const skip = (page - 1) * limit;

  try {
    const query = itemName ? { name: new RegExp(itemName, 'i') } : {};
    const products = await Product.find(query).skip(skip).limit(limit);
    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);

    res.render('index', {
      title: 'Home',
      item_name: itemName,
      product_list: products,
      currentPage: page,
      totalPages: totalPages
    });
  } catch (err) {
    console.error(err);
    res.render('index', { title: 'Home', item_name: '', product_list: [] });
  }
});

// 結帳頁面
router.get('/checkout', (req, res) => res.render('checkout'));

// 處理結帳表單提交
router.post('/checkout', (req, res) => {
  const { items, name, address, phone, city } = req.body;
  const newOrder = new Order({ items, name, address, phone, city });
  newOrder.save()
    .then(() => {
      req.flash('success_msg', 'Order placed successfully');
      res.redirect('/');
    })
    .catch(err => console.log(err));
});

// 插入產品數據
router.get('/add-products', checkAdmin, async (req, res) => {
  try {
    await Product.deleteMany({}); // 刪除現有數據
    await Product.insertMany([
      {
        name: "Sennheiser01",
        price: 29.99,
        discount: 10,
        category: "Category 1",
        image: "01.jpg",
        description: "Description for product 1"
      },
      {
        name: "Sennheiser02",
        price: 49.99,
        discount: 15,
        category: "Category 2",
        image: "02.png",
        description: "Description for product 2"
      },
      {
        name: "Sennheiser03",
        price: 19.99,
        discount: 5,
        category: "Category 3",
        image: "03.jpeg",
        description: "Description for product 3"
      },
      {
        name: "Sennheiser04",
        price: 39.99,
        discount: 20,
        category: "Category 4",
        image: "04.jpeg",
        description: "Description for product 4"
      },
      {
        name: "Sennheiser05",
        price: 59.99,
        discount: 25,
        category: "Category 5",
        image: "05.jpg",
        description: "Description for product 5"
      }
    ]);
    res.send('Products added');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error adding products');
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send('Product not found');
    }
    res.render('product', { product });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;