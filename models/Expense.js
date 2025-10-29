const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    amount: { type: Number, required: true },
    category: { type: String, enum: ["food", "transport", "shopping", "bills", "other"], default: "other" },
    date: { type: Date, default: Date.now },
    notes: { type: String, trim: true },
    attachment: { type: String, trim: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expense", expenseSchema);
