const Invoice = require("../models/invoiceModel");

// 4.1 Create Invoice
const createInvoice = async (req, res) => {
  try {
    const { customerName, invoiceNumber, amount, dueDate, status } = req.body;

    const invoice = await Invoice.create({
      user: req.user._id,
      customerName,
      invoiceNumber,
      amount,
      dueDate,
      status,
    });

    res.status(201).json({ message: "Invoice created", invoice });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4.2 Get All Invoices (Filter by Status)
const getInvoices = async (req, res) => {
  try {
    const { status } = req.query; // /invoices?status=paid (optional filter)

    let filter = { user: req.user._id };
    if (status) filter.status = status;

    const invoices = await Invoice.find(filter).sort({ createdAt: -1 });

    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4.3 Update Invoice (status or details)
const updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await Invoice.findOneAndUpdate(
      { _id: id, user: req.user._id },
      req.body,
      { new: true }
    );

    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    res.status(200).json({ message: "Invoice updated", invoice });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4.4 Share Invoice (Just mock response)
const shareInvoice = async (req, res) => {
  try {
    res.status(200).json({ message: "Invoice shared successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4.5 Delete Invoice
const deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    await Invoice.findOneAndDelete({ _id: id, user: req.user._id });
    res.status(200).json({ message: "Invoice deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createInvoice,
  getInvoices,
  updateInvoice,
  shareInvoice,
  deleteInvoice,
};
