const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  items: String,
  name: String,
  address: String,
  phone: String,
  city: String
});

module.exports = mongoose.model('Order', orderSchema);