const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

/**
 * Create a new expense/income
 * POST /api/expenses
 */
const createExpense = async (req, res) => {
  try {
    const { amount, description, type, date, categoryId } = req.body;
    const userId = req.user.id; // From authenticate middleware

    const expense = await prisma.expense.create({
      data: {
        amount: parseFloat(amount),
        description,
        type,
        date: date ? new Date(date) : new Date(),
        userId,
        categoryId: categoryId || null,
      },
      include: {
        category: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json({
      message: "Expense created successfully",
      expense,
    });
  } catch (error) {
    console.error("Create expense error:", error);
    res.status(500).json({
      error: "Failed to create expense.",
    });
  }
};

/**
 * Get all expenses for the logged-in user
 * GET /api/expenses
 * Optional query params: type, startDate, endDate, categoryId
 */
const getExpenses = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type, startDate, endDate, categoryId } = req.query;

    // Build filter object
    const where = { userId };

    if (type) {
      where.type = type;
    }

    if (categoryId) {
      where.categoryId = parseInt(categoryId);
    }

    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        where.date.gte = new Date(startDate);
      }
      if (endDate) {
        where.date.lte = new Date(endDate);
      }
    }

    const expenses = await prisma.expense.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    res.json({
      count: expenses.length,
      expenses,
    });
  } catch (error) {
    console.error("Get expenses error:", error);
    res.status(500).json({
      error: "Failed to get expenses.",
    });
  }
};

/**
 * Get single expense by ID
 * GET /api/expenses/:id
 */
const getExpenseById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const expense = await prisma.expense.findFirst({
      where: {
        id: parseInt(id),
        userId, // Ensure user can only access their own expenses
      },
      include: {
        category: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!expense) {
      return res.status(404).json({
        error: "Expense not found.",
      });
    }

    res.json({ expense });
  } catch (error) {
    console.error("Get expense by ID error:", error);
    res.status(500).json({
      error: "Failed to get expense.",
    });
  }
};

/**
 * Update an expense
 * PUT /api/expenses/:id
 */
const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { amount, description, type, date, categoryId } = req.body;

    // Check if expense exists and belongs to user
    const existingExpense = await prisma.expense.findFirst({
      where: {
        id: parseInt(id),
        userId,
      },
    });

    if (!existingExpense) {
      return res.status(404).json({
        error: "Expense not found.",
      });
    }

    // Build update data object
    const updateData = {};
    if (amount !== undefined) updateData.amount = parseFloat(amount);
    if (description !== undefined) updateData.description = description;
    if (type !== undefined) updateData.type = type;
    if (date !== undefined) updateData.date = new Date(date);
    if (categoryId !== undefined) updateData.categoryId = categoryId || null;

    const expense = await prisma.expense.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        category: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.json({
      message: "Expense updated successfully",
      expense,
    });
  } catch (error) {
    console.error("Update expense error:", error);
    res.status(500).json({
      error: "Failed to update expense.",
    });
  }
};

/**
 * Delete an expense
 * DELETE /api/expenses/:id
 */
const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if expense exists and belongs to user
    const existingExpense = await prisma.expense.findFirst({
      where: {
        id: parseInt(id),
        userId,
      },
    });

    if (!existingExpense) {
      return res.status(404).json({
        error: "Expense not found.",
      });
    }

    await prisma.expense.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      message: "Expense deleted successfully",
    });
  } catch (error) {
    console.error("Delete expense error:", error);
    res.status(500).json({
      error: "Failed to delete expense.",
    });
  }
};

module.exports = {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
};
