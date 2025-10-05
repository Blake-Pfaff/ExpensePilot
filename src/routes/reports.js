const express = require("express");
const router = express.Router();
const reportsController = require("../controllers/reports");
const { authenticate } = require("../middleware/auth");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// All report routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/reports/monthly:
 *   get:
 *     summary: Get monthly income and expense report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Year (defaults to current year)
 *         example: 2025
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         description: Month (1-12, defaults to current month)
 *         example: 10
 *     responses:
 *       200:
 *         description: Monthly report with income, expenses, and category breakdown
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 period:
 *                   type: object
 *                   properties:
 *                     year:
 *                       type: integer
 *                       example: 2025
 *                     month:
 *                       type: integer
 *                       example: 10
 *                     monthName:
 *                       type: string
 *                       example: October
 *                     startDate:
 *                       type: string
 *                       format: date-time
 *                     endDate:
 *                       type: string
 *                       format: date-time
 *                 summary:
 *                   type: object
 *                   properties:
 *                     totalIncome:
 *                       type: number
 *                       example: 5000.00
 *                     totalExpenses:
 *                       type: number
 *                       example: 2500.50
 *                     netSavings:
 *                       type: number
 *                       example: 2499.50
 *                     transactionCount:
 *                       type: integer
 *                       example: 25
 *                 expensesByCategory:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       category:
 *                         type: string
 *                         example: Groceries
 *                       categoryId:
 *                         type: integer
 *                         example: 1
 *                       total:
 *                         type: number
 *                         example: 800.00
 *                       count:
 *                         type: integer
 *                         example: 10
 *                 uncategorized:
 *                   type: number
 *                   example: 150.00
 *       401:
 *         description: Unauthorized
 */
router.get("/monthly", reportsController.getMonthlyReport);

/**
 * @swagger
 * /api/reports/category:
 *   get:
 *     summary: Get spending report grouped by category
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter expenses after this date
 *         example: 2025-01-01T00:00:00Z
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter expenses before this date
 *         example: 2025-12-31T23:59:59Z
 *     responses:
 *       200:
 *         description: Category report with spending breakdown
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 period:
 *                   type: object
 *                   properties:
 *                     startDate:
 *                       type: string
 *                     endDate:
 *                       type: string
 *                 summary:
 *                   type: object
 *                   properties:
 *                     totalExpenses:
 *                       type: number
 *                       example: 2500.50
 *                     categoryCount:
 *                       type: integer
 *                       example: 5
 *                     transactionCount:
 *                       type: integer
 *                       example: 25
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       category:
 *                         type: string
 *                         example: Groceries
 *                       categoryId:
 *                         type: integer
 *                         example: 1
 *                       totalAmount:
 *                         type: number
 *                         example: 800.00
 *                       count:
 *                         type: integer
 *                         example: 10
 *                       percentage:
 *                         type: number
 *                         example: 32.00
 *                       averageAmount:
 *                         type: number
 *                         example: 80.00
 *       401:
 *         description: Unauthorized
 */
router.get("/category", reportsController.getCategoryReport);

module.exports = router;
