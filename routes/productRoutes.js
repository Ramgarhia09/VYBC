const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  addProduct,
  getProducts,
  updateStock,
  getCategories,
} = require("../controllers/productController");

router.post("/products", protect, addProduct);
router.get("/products", protect, getProducts);
router.put("/stock/update/:id", protect, updateStock);
router.get("/categories", protect, getCategories);

module.exports = router;
