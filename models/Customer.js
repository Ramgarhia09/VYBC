const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, trim: true },
    phone: { type: String, trim: true },
    address: { type: String },
    status: {
      type: String,
      enum: ["Active", "Inactive", "New", "VIP"],
      default: "New"
    },
    totalSpent: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customer", customerSchema);
