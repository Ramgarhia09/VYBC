const express = require("express");
const router = express.Router();
const {
  addCustomer,
  getCustomers,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customerController");
const { protect } = require("../middleware/authMiddleware");

// protected routes
router.route("/")
  .post(protect, addCustomer)
  .get(protect, getCustomers);

router.route("/:id")
  .put(protect, updateCustomer)
  .delete(protect, deleteCustomer);

module.exports = router;
