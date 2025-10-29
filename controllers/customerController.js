const Customer = require("../models/Customer");

// @desc Add new customer
// @route POST /api/customers
// @access Private
const addCustomer = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const customer = await Customer.create({
      user: req.user._id,
      name,
      email,
      phone,
      address,
    });

    res.status(201).json(customer);
  } catch (error) {
    console.error("Add Customer Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Get all customers
// @route GET /api/customers
// @access Private
const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({ user: req.user._id });
    res.json(customers);
  } catch (error) {
    console.error("Get Customers Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Update customer
// @route PUT /api/customers/:id
// @access Private
const updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const updated = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({ message: "Customer updated successfully", customer: updated });
  } catch (error) {
    console.error("Update Customer Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Delete customer
// @route DELETE /api/customers/:id
// @access Private
const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    await customer.deleteOne();
    res.json({ message: "Customer deleted successfully" });
  } catch (error) {
    console.error("Delete Customer Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  addCustomer,
  getCustomers,
  updateCustomer,
  deleteCustomer,
};
