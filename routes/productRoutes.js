const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  addProduct,
  getProducts,
  updateStock,
  getCategories,
} = require("../controllers/productController");

// ✅ Do NOT write "/products" again
router.post("/", protect, addProduct);
router.get("/", protect, getProducts);
router.put("/stock/update/:id", protect, updateStock);
router.get("/categories", protect, getCategories);

module.exports = router;
