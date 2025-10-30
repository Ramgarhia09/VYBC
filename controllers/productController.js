const Product = require("../models/Product");

// Helper function to set status based on stock or age
const computeStatus = (product) => {
  if (product.stock === 0) return "out";
  if (product.stock > 0 && product.stock < 5) return "low";

  // If created within last 7 days → new
  const daysOld = (Date.now() - product.createdAt) / (1000 * 60 * 60 * 24);
  if (daysOld <= 7) return "new";

  return "active";
};

// 3.1 Add product
const addProduct = async (req, res) => {
  try {
    const { name, category, price, stock, description } = req.body;

    if (!name || !category || !price) {
      return res.status(400).json({ message: "Name, category & price required" });
    }

    let product = await Product.create({
      user: req.user._id,
      name,
      category,
      price,
      stock,
      description,
    });

    // Set correct status
    product.status = computeStatus(product);
    await product.save();

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3.2 List products with Filter
const getProducts = async (req, res) => {
  try {
    const { filter } = req.query; // all | active | low | out | new

    let query = { user: req.user._id };

    if (filter && filter !== "all") {
      query.status = filter;
    }

    const products = await Product.find(query).sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3.3 Update stock + auto update status
const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    const product = await Product.findOne({ _id: id, user: req.user._id });
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.stock = stock;

    // Auto-Update Status
    if (stock === 0) product.status = "out";
    else if (stock > 0 && stock <= 10) product.status = "low";
    else product.status = "active";

    await product.save();

    res.status(200).json({ message: "Stock & status updated", product });
  } catch (error) {
    console.error("Update Stock Error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// 3.4 Get categories
const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct("category", { user: req.user._id });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3.5 Dashboard Stats
const getProductStats = async (req, res) => {
  try {
    const user = req.user._id;

    const total = await Product.countDocuments({ user });
    const low = await Product.countDocuments({ user, status: "low" });
    const out = await Product.countDocuments({ user, status: "out" });

    res.json({ total, low, out });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addProduct,
  getProducts,
  updateStock,
  getCategories,
  getProductStats,
};

