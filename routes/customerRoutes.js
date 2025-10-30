const express = require("express");
const router = express.Router();
const {
  addCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
   updateCustomerStats,
  getTopSpendingCustomers,
  getCustomerStats
} = require("../controllers/customerController");
const { protect } = require("../middleware/authMiddleware");

// Reports / special endpoints (place BEFORE :id)
router.get("/reports/top-spending", protect, getTopSpendingCustomers);
router.get("/reports/stats", protect, getCustomerStats);
// protected routes
router.route("/")
  .post(protect, addCustomer)
  .get(protect, getCustomers);

router.route("/:id")
  .get(protect, getCustomerById)
  .put(protect, updateCustomer)
  .delete(protect, deleteCustomer);


  
// Update stats
router.patch("/:id/update-stats", protect, updateCustomerStats);
module.exports = router;


