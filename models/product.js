const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  discount: Number,
  category: String,
  description: String,
  image: String
});

module.exports = mongoose.model('Product', productSchema);