const express = require("express");
const router = express.Router();
const categoriesController = require("../controllers/categories");
const {
  validateCreateCategory,
  validateUpdateCategory,
} = require("../validators/categories");
const { authenticate } = require("../middleware/auth");

// All category routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/categories
 * @desc    Create a new category
 * @access  Private
 */
router.post("/", validateCreateCategory, categoriesController.createCategory);

/**
 * @route   GET /api/categories
 * @desc    Get all categories
 * @access  Private
 */
router.get("/", categoriesController.getCategories);

/**
 * @route   GET /api/categories/:id
 * @desc    Get single category by ID
 * @access  Private
 */
router.get("/:id", categoriesController.getCategoryById);

/**
 * @route   PUT /api/categories/:id
 * @desc    Update a category
 * @access  Private
 */
router.put("/:id", validateUpdateCategory, categoriesController.updateCategory);

/**
 * @route   DELETE /api/categories/:id
 * @desc    Delete a category
 * @access  Private
 */
router.delete("/:id", categoriesController.deleteCategory);

module.exports = router;
