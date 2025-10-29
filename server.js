const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const customerRoutes = require("./routes/customerRoutes");
const productRoutes = require("./routes/productRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const expenseRoutes = require("./routes/expenseRoutes"); // ✅ CORRECT

const { errorHandler } = require("./middleware/errorHandler");


connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // ✅ Must be BEFORE routes

// Root route for testing
app.get("/", (req, res) => {
  res.send("Backend server is running!");
});

// Auth routes
app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/inventory", productRoutes);
app.use("/api", invoiceRoutes); 
app.use('/api/expenses', expenseRoutes);
// Error handler

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
import serverless from "serverless-http";
export default serverless(app);
