const express = require("express");
const router = express.Router();
const expensesController = require("../controllers/expenses");
const {
  validateCreateExpense,
  validateUpdateExpense,
} = require("../validators/expenses");
const { authenticate } = require("../middleware/auth");

// All expense routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/expenses
 * @desc    Create a new expense or income
 * @access  Private
 */
router.post("/", validateCreateExpense, expensesController.createExpense);

/**
 * @route   GET /api/expenses
 * @desc    Get all expenses for logged-in user
 * @access  Private
 * @query   type, startDate, endDate, categoryId (optional filters)
 */
router.get("/", expensesController.getExpenses);

/**
 * @route   GET /api/expenses/:id
 * @desc    Get single expense by ID
 * @access  Private
 */
router.get("/:id", expensesController.getExpenseById);

/**
 * @route   PUT /api/expenses/:id
 * @desc    Update an expense
 * @access  Private
 */
router.put("/:id", validateUpdateExpense, expensesController.updateExpense);

/**
 * @route   DELETE /api/expenses/:id
 * @desc    Delete an expense
 * @access  Private
 */
router.delete("/:id", expensesController.deleteExpense);

module.exports = router;
