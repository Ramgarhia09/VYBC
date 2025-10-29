const Product = require("../models/Product");

// 3.1 Add product
const addProduct = async (req, res) => {
  try {
    const { name, category, price, stock, description } = req.body;

    if (!name || !category || !price) {
      return res.status(400).json({ message: "Name, category & price required" });
    }

    const product = await Product.create({
      user: req.user._id,
      name,
      category,
      price,
      stock,
      description,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Add Product Error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 3.2 List all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ user: req.user._id });
    res.status(200).json(products);
  } catch (error) {
    console.error("Get Products Error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 3.3 Update stock
const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    const product = await Product.findOne({ _id: id, user: req.user._id });
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.stock = stock;
    await product.save();

    res.status(200).json({ message: "Stock updated", product });
  } catch (error) {
    console.error("Update Stock Error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 3.4 Get unique categories
const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct("category", { user: req.user._id });
    res.status(200).json(categories);
  } catch (error) {
    console.error("Get Categories Error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { addProduct, getProducts, updateStock, getCategories };
