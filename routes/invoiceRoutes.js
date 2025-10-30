const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createInvoice,
  getInvoices,
  updateInvoice,
  shareInvoice,
  deleteInvoice,
} = require("../controllers/invoiceController");

router.post("/invoices", protect, createInvoice);          
router.get("/invoices", protect, getInvoices);              
router.put("/invoices/:id", protect, updateInvoice);        
router.post("/invoices/:id/share", protect, shareInvoice);  
router.delete("/invoices/:id", protect, deleteInvoice);     

module.exports = router;
