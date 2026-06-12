
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: String,
  address: String,
  fullName: String,
  phone: String,
  paymentMethod: String,
  total: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);