const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const serverless = require("serverless-http");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const customerRoutes = require("./routes/customerRoutes");
const productRoutes = require("./routes/productRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const { errorHandler } = require("./middleware/errorHandler");

connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("Backend server is running!");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/inventory", productRoutes);
app.use("/api", invoiceRoutes);
app.use("/api/expenses", expenseRoutes);

app.use(errorHandler);

// ❗ IMPORTANT — REMOVE app.listen()
// app.listen(PORT, () => console.log("Server running"));

// ✅ EXPORT for Vercel
module.exports = app;
module.exports.handler = serverless(app);
