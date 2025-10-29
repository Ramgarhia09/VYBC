const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  items: [
    {
      name: String,
      quantity: Number,
      price: Number,
    },
  ],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ["pending", "paid", "cancelled"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Invoice", invoiceSchema);
