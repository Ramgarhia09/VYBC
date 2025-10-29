const express = require('express');
const router = express.Router();
const {
  addExpense,
  listExpenses,
  updateExpense,
  deleteExpense,
  getSummary,
} = require('../controllers/expenseController');

const { protect } = require('../middleware/authMiddleware');

// Routes
router.post('/', protect, addExpense);       // Add expense
router.get('/', protect, listExpenses);      // List expenses
router.get('/summary', protect, getSummary); // Expense summary
router.put('/:id', protect, updateExpense);  // Update expense
router.delete('/:id', protect, deleteExpense); // Delete expense

module.exports = router;
