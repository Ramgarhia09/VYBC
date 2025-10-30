const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    description: { type: String, default: "" },

    // Automatically maintain product state
    status: {
      type: String,
      enum: ["active", "low", "out", "new"],
      default: "new",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
