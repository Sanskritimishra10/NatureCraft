// routes/order.js
const express = require("express");
const Order = require("../models/Order");
const { auth } = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, async (req, res) => {
  const order = new Order({
    userId: req.userId,
    ...req.body
  });

  await order.save();

  res.json({ message: "Order placed successfully" });
});

module.exports = router;
