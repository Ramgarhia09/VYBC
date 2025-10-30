const express = require("express");
const router = express.Router();
const {
  createInvoice,
  getInvoices,
  updateInvoice,
  shareInvoice,
} = require("../controllers/invoiceController");

// Billing & Invoicing APIs
router.post("/invoices", createInvoice);           // 4.1
router.get("/invoices", getInvoices);              // 4.2
router.put("/invoices/:id", updateInvoice);        // 4.3
router.post("/invoices/:id/share", shareInvoice);  // 4.4
router.delete("/invoices/:id", protect, deleteInvoice);
module.exports = router;

