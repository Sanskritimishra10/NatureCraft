const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const connectDB = require("./config/db");
const Product = require("./models/Product");
const authRoutes = require("./routes/auth");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");

const app = express();
const frontendOrigin = process.env.FRONTEND_URL || "http://localhost:5173";
const corsOptions = {
  origin(origin, callback) {
    if (!origin || origin === frontendOrigin) {
      callback(null, frontendOrigin);
      return;
    }

    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

const seedProducts = [
  {
    id: 1,
    name: "4 Suta Raw Makhana",
    type: "raw",
    flavor: "Plain",
    suta: "4 Suta",
    price: 189,
    description:
      "Small-sized natural phool makhana with a light crunch, ideal for roasting at home and everyday cooking.",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Phool%20Makhana.JPG?width=900",
    highlights: ["100% natural", "Cooking essential", "4 suta grade"],
  },
  {
    id: 2,
    name: "5 Suta Raw Makhana",
    type: "raw",
    flavor: "Plain",
    suta: "5 Suta",
    price: 209,
    description:
      "Balanced size and texture for homemade roasting, fasting snacks, and premium kitchen use.",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Foxnut%20Makhana%20-%20Nawada%20District%20-%20Bihar%20-%201.jpg?width=900",
    highlights: ["Mithila makhana", "Balanced size", "5 suta grade"],
  },
  {
    id: 3,
    name: "6 Suta Raw Makhana",
    type: "raw",
    flavor: "Plain",
    suta: "6 Suta",
    price: 229,
    description:
      "Extra-large raw makhana with bright color and a premium look, perfect for recipes and private roasting.",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Foxnut%20Makhana%20-%20Nawada%20District%20-%20Bihar%20-%201.jpg?width=900",
    highlights: ["Premium size", "Bright white", "6 suta grade"],
  },
  {
    id: 4,
    name: "7 Suta Raw Makhana",
    type: "raw",
    flavor: "Plain",
    suta: "7 Suta",
    price: 249,
    description:
      "Large and airy raw fox nuts crafted for gifting-grade presentation, festive recipes, and premium resale.",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Phool%20Makhana.JPG?width=900",
    highlights: ["Luxury grade", "Festive use", "7 suta grade"],
  },
];

let syncPromise = null;

const syncProducts = async () => {
  const seedIds = seedProducts.map((product) => product.id);

  await Product.bulkWrite(
    seedProducts.map((product) => ({
      updateOne: {
        filter: { id: product.id },
        update: { $set: product },
        upsert: true,
      },
    })),
  );

  await Product.deleteMany({ id: { $nin: seedIds } });
  console.log(`Products synced: ${seedProducts.length} items`);
};

const ensureProductsSynced = async () => {
  if (!syncPromise) {
    syncPromise = (async () => {
      const count = await Product.countDocuments();

      if (count !== seedProducts.length) {
        await syncProducts();
        return;
      }

      const storedIds = await Product.find({}, { id: 1, _id: 0 }).lean();
      const storedIdSet = new Set(storedIds.map((product) => product.id));
      const isMissingSeedProduct = seedProducts.some(
        (product) => !storedIdSet.has(product.id),
      );

      if (isMissingSeedProduct) {
        await syncProducts();
      }
    })().finally(() => {
      syncPromise = null;
    });
  }

  await syncPromise;
};

const startServer = async () => {
  await connectDB();
  await syncProducts();

  app.use(cors(corsOptions));
  app.options("*", cors(corsOptions));
  app.use(express.json());
  app.use(cookieParser());

  app.use("/api/auth", authRoutes);
  app.use("/api/cart", cartRoutes);
  app.use("/api/order", orderRoutes);

  app.get("/products", async (req, res) => {
    try {
      await ensureProductsSynced();

      const filters = {};

      if (req.query.type && req.query.type !== "all") {
        filters.type = req.query.type;
      }

      if (req.query.flavor && req.query.flavor !== "all") {
        filters.flavor = req.query.flavor;
      }

      if (req.query.suta && req.query.suta !== "all") {
        filters.suta = req.query.suta;
      }

      const sort = {};

      if (req.query.sort === "low") {
        sort.price = 1;
      } else if (req.query.sort === "high") {
        sort.price = -1;
      } else {
        sort.id = 1;
      }

      const products = await Product.find(filters).sort(sort).lean();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Unable to load products" });
    }
  });

  app.listen(5000, () => {
    console.log("Server running on port 5000");
  });
};

startServer().catch((error) => {
  console.log("Server startup error:", error.message);
  process.exit(1);
});
