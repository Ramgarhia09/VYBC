const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
  addProduct,
  getProducts,
  updateStock,
  getCategories,
  getProductStats,
} = require("../controllers/productController");

router.post("/", protect, addProduct);
router.get("/", protect, getProducts);   // ?filter=active,new,low,out
router.put("/stock/update/:id", protect, updateStock);
router.get("/categories", protect, getCategories);
router.get("/stats", protect, getProductStats);

module.exports = router;
