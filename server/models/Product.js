const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      required: true,
      enum: ["raw", "roasted", "flavored"],
    },
    flavor: { type: String, default: "Plain", trim: true },
    suta: { type: String, default: null, trim: true },
    price: { type: Number, required: true },
    description: { type: String, default: "" },
    image: { type: String, required: true },
    highlights: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
