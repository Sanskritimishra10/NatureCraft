const express = require("express");
const Product = require("../models/Product");
const User = require("../models/User");
const { auth } = require("../middleware/auth");

const router = express.Router();

const buildCartItems = async (cartItems) => {
  const productIds = cartItems.map((item) => item.productId);
  const products = await Product.find({ id: { $in: productIds } }).lean();
  const productMap = new Map(products.map((product) => [product.id, product]));

  return cartItems
    .map((item) => {
      const product = productMap.get(item.productId);

      if (!product) {
        return null;
      }

      return {
        productId: item.productId,
        quantity: item.quantity,
        name: product.name,
        price: product.price,
        image: product.image,
        type: product.type,
        flavor: product.flavor,
        suta: product.suta,
      };
    })
    .filter(Boolean);
};

router.post("/add", auth, async (req, res) => {
  try {
    const payload = req.body.product || req.body;
    const productId = Number(payload.productId);
    const quantity = Number(payload.quantity || 1);

    if (!productId || quantity < 1) {
      return res.status(400).json({ message: "Valid product and quantity are required" });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existing = user.cart.find((item) => item.productId === productId);

    if (existing) {
      existing.quantity += quantity;
    } else {
      user.cart.push({ productId, quantity });
    }

    await user.save();

    const items = await buildCartItems(user.cart);
    res.json({ items });
  } catch (error) {
    res.status(500).json({ message: "Unable to add item" });
  }
});

router.post("/remove", auth, async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.cart = user.cart.filter((item) => item.productId !== Number(productId));
    await user.save();

    const items = await buildCartItems(user.cart);
    res.json({ items });
  } catch (error) {
    res.status(500).json({ message: "Unable to remove item" });
  }
});

router.post("/update", auth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const normalizedQuantity = Number(quantity);
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (normalizedQuantity < 1) {
      user.cart = user.cart.filter((item) => item.productId !== Number(productId));
    } else {
      user.cart = user.cart.map((item) =>
        item.productId === Number(productId)
          ? { ...item.toObject(), quantity: normalizedQuantity }
          : item
      );
    }

    await user.save();

    const items = await buildCartItems(user.cart);
    res.json({ items });
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("cart");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const items = await buildCartItems(user.cart || []);
    res.json({ items });
  } catch (error) {
    res.status(500).json({ message: "Unable to load cart" });
  }
});

module.exports = router;
