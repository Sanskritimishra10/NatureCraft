const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Product = require("../models/Product");
const { auth } = require("../middleware/auth");
const { sendEmailOTP } = require("../utils/sendEmailOtp");
const sendSMS = require("../utils/sendSMS");

const otpStore = {};
const router = express.Router();

const buildUserPayload = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  savedAddress: user.savedAddress,
  wishlistCount: user.wishlist?.length || 0,
  cartCount: (user.cart || []).reduce(
    (sum, item) => sum + (item.quantity || 0),
    0,
  ),
});

const setAuthCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

/* ================= SIGNUP ================= */
router.post("/signup", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !password || (!email && !phone)) {
      return res.status(400).json({ message: "All fields required" });
    }

    let existingUser;

    if (email) {
      existingUser = await User.findOne({ email });
    } else if (phone) {
      existingUser = await User.findOne({ phone });
    }

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: buildUserPayload(user),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: input });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    setAuthCookie(res, token);

    res.json({
      message: "Login successful",
      user: buildUserPayload(user),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= SEND OTP ================= */
router.post("/send-otp", async (req, res) => {
  const { input } = req.body;

  if (!input) {
    return res.status(400).json({ message: "Input required" });
  }

  const isEmail = input.includes("@");
  const isPhone = /^[6-9]\d{9}$/.test(input); // Indian number

  if (!isEmail && !isPhone) {
    return res.status(400).json({ message: "Invalid email or phone" });
  }

  let user;
  if (isEmail) user = await User.findOne({ email: input });
  else user = await User.findOne({ phone: input });

  if (!user) {
    return res.status(404).json({ message: "User not registered" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000);

  otpStore[input] = {
    otp,
    expires: Date.now() + 5 * 60 * 1000,
  };

  try {
    if (isEmail) {
      await sendEmailOTP(input, otp);
    } else {
      await sendSMS(input, otp); // 🔥 MSG91 call
    }

    res.json({ message: "OTP sent" });
  } catch (err) {
    res.status(500).json({ message: "OTP sending failed" });
  }
  console.log("Sending OTP to:", input);
});

/* ================= VERIFY OTP ================= */
router.post("/verify-otp", async (req, res) => {
  try {
    const { input, otp } = req.body;

    const record = otpStore[input];

    if (!record) {
      return res.status(400).json({ message: "OTP not found" });
    }

    if (Date.now() > record.expires) {
      return res.status(400).json({ message: "OTP expired" });
    }

    if (record.otp !== Number(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    let user = await User.findOne({ email: input });

    if (!user) {
      user = await User.create({ email: input });
    }

    // ✅ CREATE TOKEN
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // ✅ SET COOKIE
    setAuthCookie(res, token);

    delete otpStore[input];

    res.json({
      message: "Login successful",
      user: buildUserPayload(user),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= GET USER ================= */
router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.userId);
  res.json({ user: buildUserPayload(user) });
});

/* ================= LOGOUT ================= */
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});

/* ================= ADDRESS ================= */
router.get("/address", auth, async (req, res) => {
  const user = await User.findById(req.userId);
  res.json({ address: user.savedAddress || null });
});

router.post("/address", auth, async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.userId,
    {
      savedAddress: {
        ...req.body,
        updatedAt: new Date(),
      },
    },
    { new: true },
  );

  res.json({ address: user.savedAddress });
});

/* ================= WISHLIST ================= */
router.get("/wishlist", auth, async (req, res) => {
  const user = await User.findById(req.userId);

  const products = await Product.find({
    id: { $in: user.wishlist.map((i) => i.productId) },
  });

  res.json({ items: products });
});

router.post("/wishlist/toggle", auth, async (req, res) => {
  const { productId } = req.body;

  const user = await User.findById(req.userId);

  const index = user.wishlist.findIndex(
    (i) => i.productId === Number(productId),
  );

  if (index >= 0) user.wishlist.splice(index, 1);
  else user.wishlist.push({ productId: Number(productId) });

  await user.save();

  res.json({ wishlistCount: user.wishlist.length });
});

/* ================= UPDATE PROFILE ================= */
router.put("/update", auth, async (req, res) => {
  const user = await User.findByIdAndUpdate(req.userId, req.body, {
    new: true,
  });

  res.json({ user });
});

module.exports = router;
