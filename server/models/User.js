const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "User",
    },

    email: {
      type: String,
      unique: true,
      sparse: true, // 🔥 allows null
    },

    phone: {
      type: String,
      unique: true,
      sparse: true,
    },

    password: {
      type: String,
      default: "",
    },

    savedAddress: {
      fullName: String,
      phone: String,
      altPhone: String,
      flat: String,
      locality: String,
      city:String,
      pincode:Number,
      addressType: {
        type: String,
        enum: ["home", "work"],
        default: "home",
      },
      updatedAt: Date,
    },

    // 🔥 ADD THIS
    cart: [
      {
        productId: Number,
        quantity: Number,
      },
    ],

    // 🔥 ADD THIS
    wishlist: [
      {
        productId: Number,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);