const Invoice = require("../models/Invoice");
const nodemailer = require("nodemailer");
const twilio = require("twilio"); // optional if using WhatsApp

// 4.1 Create invoice
const createInvoice = async (req, res) => {
  try {
    const { customerName, email, phone, items, totalAmount, status } = req.body;

    const invoice = await Invoice.create({
      customerName,
      email,
      phone,
      items,
      totalAmount,
      status,
    });

    res.status(201).json({ message: "Invoice created successfully", invoice });
  } catch (error) {
    res.status(500).json({ message: "Error creating invoice", error: error.message });
  }
};

// 4.2 Get all invoices
const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: "Error fetching invoices", error: error.message });
  }
};

// 4.3 Update invoice
const updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.json({ message: "Invoice updated", invoice });
  } catch (error) {
    res.status(500).json({ message: "Error updating invoice", error: error.message });
  }
};

// 4.4 Share invoice via Email/WhatsApp
const shareInvoice = async (req, res) => {
  try {
    const { method } = req.body; // 'email' or 'whatsapp'
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    if (method === "email") {
      // Send via email
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: invoice.email,
        subject: "Invoice Details",
        text: `Hello ${invoice.customerName}, your invoice total is ₹${invoice.totalAmount}`,
      };

      await transporter.sendMail(mailOptions);
      res.json({ message: "Invoice shared via Email" });
    } else if (method === "whatsapp") {
      // Optional: send via Twilio WhatsApp API
      const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
      await client.messages.create({
        from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
        to: `whatsapp:${invoice.phone}`,
        body: `Hello ${invoice.customerName}, your invoice total is ₹${invoice.totalAmount}`,
      });
      res.json({ message: "Invoice shared via WhatsApp" });
    } else {
      res.status(400).json({ message: "Invalid share method" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error sharing invoice", error: error.message });
  }
};

module.exports = {
  createInvoice,
  getInvoices,
  updateInvoice,
  shareInvoice,
};
