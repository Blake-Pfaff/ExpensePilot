const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const getMonthlyReport = async (req, res) => {
  try {
    const userId = req.user.id;
    const { year, month } = req.query;

    // Build date filter
    const currentDate = new Date();
    const targetYear = year ? parseInt(year) : currentDate.getFullYear();
    const targetMonth = month ? parseInt(month) - 1 : currentDate.getMonth();

    // Start and end of the month
    const startDate = new Date(targetYear, targetMonth, 1);
    const endDate = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59);

    // Get all expenses for the month
    const expenses = await prisma.expense.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        category: true,
      },
    });

    // Calculate totals
    const income = expenses
      .filter((e) => e.type === "income")
      .reduce((sum, e) => sum + e.amount, 0);

    const totalExpenses = expenses
      .filter((e) => e.type === "expense")
      .reduce((sum, e) => sum + e.amount, 0);

    const netSavings = income - totalExpenses;

    // Group expenses by category
    const expensesByCategory = expenses
      .filter((e) => e.type === "expense" && e.category)
      .reduce((acc, expense) => {
        const categoryName = expense.category.name;
        if (!acc[categoryName]) {
          acc[categoryName] = {
            category: categoryName,
            categoryId: expense.categoryId,
            total: 0,
            count: 0,
          };
        }
        acc[categoryName].total += expense.amount;
        acc[categoryName].count += 1;
        return acc;
      }, {});

    // Convert to array and sort by total
    const categoryBreakdown = Object.values(expensesByCategory).sort(
      (a, b) => b.total - a.total
    );

    // Uncategorized expenses
    const uncategorized = expenses
      .filter((e) => e.type === "expense" && !e.category)
      .reduce((sum, e) => sum + e.amount, 0);

    res.json({
      period: {
        year: targetYear,
        month: targetMonth + 1,
        monthName: startDate.toLocaleString("default", { month: "long" }),
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
      summary: {
        totalIncome: parseFloat(income.toFixed(2)),
        totalExpenses: parseFloat(totalExpenses.toFixed(2)),
        netSavings: parseFloat(netSavings.toFixed(2)),
        transactionCount: expenses.length,
      },
      expensesByCategory: categoryBreakdown.map((c) => ({
        ...c,
        total: parseFloat(c.total.toFixed(2)),
      })),
      uncategorized: parseFloat(uncategorized.toFixed(2)),
    });
  } catch (error) {
    console.error("Get monthly report error:", error);
    res.status(500).json({
      error: "Failed to generate monthly report.",
    });
  }
};

/**
 * Get spending report by category
 * GET /api/reports/category
 * Query params: startDate, endDate (optional)
 */
const getCategoryReport = async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate } = req.query;

    // Build date filter
    const where = { userId, type: "expense" };

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    // Get all expenses
    const expenses = await prisma.expense.findMany({
      where,
      include: {
        category: true,
      },
    });

    // Group by category
    const categoryData = expenses.reduce((acc, expense) => {
      const categoryName = expense.category?.name || "Uncategorized";
      const categoryId = expense.categoryId || null;

      if (!acc[categoryName]) {
        acc[categoryName] = {
          category: categoryName,
          categoryId: categoryId,
          totalAmount: 0,
          count: 0,
          expenses: [],
        };
      }

      acc[categoryName].totalAmount += expense.amount;
      acc[categoryName].count += 1;
      acc[categoryName].expenses.push({
        id: expense.id,
        amount: expense.amount,
        description: expense.description,
        date: expense.date,
      });

      return acc;
    }, {});

    // Convert to array and calculate percentages
    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

    const categories = Object.values(categoryData)
      .map((cat) => ({
        category: cat.category,
        categoryId: cat.categoryId,
        totalAmount: parseFloat(cat.totalAmount.toFixed(2)),
        count: cat.count,
        percentage:
          totalSpent > 0
            ? parseFloat(((cat.totalAmount / totalSpent) * 100).toFixed(2))
            : 0,
        averageAmount: parseFloat((cat.totalAmount / cat.count).toFixed(2)),
      }))
      .sort((a, b) => b.totalAmount - a.totalAmount);

    res.json({
      period: {
        startDate: startDate || "All time",
        endDate: endDate || "Present",
      },
      summary: {
        totalExpenses: parseFloat(totalSpent.toFixed(2)),
        categoryCount: categories.length,
        transactionCount: expenses.length,
      },
      categories,
    });
  } catch (error) {
    console.error("Get category report error:", error);
    res.status(500).json({
      error: "Failed to generate category report.",
    });
  }
};

module.exports = {
  getMonthlyReport,
  getCategoryReport,
};
