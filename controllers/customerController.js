const Customer = require("../models/Customer");

// @desc Add customer
// @route POST /api/customers
// @access Protected
const addCustomer = async (req, res) => {
  try {
    const { name, email, phone, address, status } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });

    const customer = new Customer({ name, email, phone, address, status });
    await customer.save();
    return res.status(201).json({ message: "Customer added successfully", customer });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// @desc Get all customers (with search & status filters & pagination)
// @route GET /api/customers
// @access Protected
const getCustomers = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const query = {};

    if (status) query.status = status;
    if (search) {
      const regex = new RegExp(search, "i");
      query.$or = [{ name: regex }, { phone: regex }, { email: regex }];
    }

    const customers = await Customer.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Customer.countDocuments(query);
    return res.json({ customers, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// @desc Get single customer by id
// @route GET /api/customers/:id
// @access Protected
const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    return res.json(customer);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// @desc Update customer
// @route PUT /api/customers/:id
// @access Protected
const updateCustomer = async (req, res) => {
  try {
    const updates = req.body;
    const customer = await Customer.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    return res.json({ message: "Customer updated", customer });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// @desc Delete customer
// @route DELETE /api/customers/:id
// @access Protected
const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    return res.json({ message: "Customer deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// @desc Update customer stats after invoice (orderAmount increases totalSpent & totalOrders)
// @route PATCH /api/customers/:id/update-stats
// @access Protected
const updateCustomerStats = async (req, res) => {
  try {
    const { orderAmount = 0 } = req.body;
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: "Customer not found" });

    customer.totalSpent = (customer.totalSpent || 0) + Number(orderAmount);
    customer.totalOrders = (customer.totalOrders || 0) + 1;
    // optional: update status based on rules
    await customer.save();
    return res.json({ message: "Stats updated", customer });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// @desc Get top spending customers
// @route GET /api/customers/reports/top-spending
// @access Protected
const getTopSpendingCustomers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const customers = await Customer.find({})
      .sort({ totalSpent: -1 })
      .limit(limit)
      .select("name totalSpent totalOrders status");
    return res.json(customers);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// @desc Get customer status counts (for dashboard tabs)
// @route GET /api/customers/reports/stats
// @access Protected
const getCustomerStats = async (req, res) => {
  try {
    const total = await Customer.countDocuments();
    const active = await Customer.countDocuments({ status: "Active" });
    const newCount = await Customer.countDocuments({ status: "New" });
    const inactive = await Customer.countDocuments({ status: "Inactive" });
    const vip = await Customer.countDocuments({ status: "VIP" });

    return res.json({ total, active, new: newCount, inactive, vip });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  addCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  updateCustomerStats,
  getTopSpendingCustomers,
  getCustomerStats
};
