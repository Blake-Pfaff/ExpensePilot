const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const { validateRegister, validateLogin } = require("../validators/auth");
const { authenticate } = require("../middleware/auth");

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post("/register", validateRegister, authController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user and get JWT token
 * @access  Public
 */
router.post("/login", validateLogin, authController.login);

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged-in user profile
 * @access  Private (requires JWT token)
 */
router.get("/me", authenticate, authController.getProfile);

module.exports = router;
