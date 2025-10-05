// Load test environment variables BEFORE anything else
require("dotenv").config({ path: ".env.test" });

const { PrismaClient } = require("@prisma/client");

// Create Prisma Client with explicit datasources config
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// Helper to clean database before each test
const clearDatabase = async () => {
  await prisma.expense.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
};

// Helper to create a test user
const createTestUser = async (userData = {}) => {
  const bcrypt = require("bcryptjs");
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(
    userData.password || "password123",
    salt
  );

  return await prisma.user.create({
    data: {
      name: userData.name || "Test User",
      email: userData.email || "test@example.com",
      password: hashedPassword,
    },
  });
};

// Helper to create a test category
const createTestCategory = async (name = "Test Category") => {
  return await prisma.category.create({
    data: { name },
  });
};

// Helper to create a test expense
const createTestExpense = async (userId, data = {}) => {
  return await prisma.expense.create({
    data: {
      amount: data.amount || 50.99,
      description: data.description || "Test Expense",
      type: data.type || "expense",
      userId: userId,
      categoryId: data.categoryId || null,
      date: data.date || new Date(),
    },
  });
};

// Cleanup after all tests
afterAll(async () => {
  await prisma.$disconnect();
});

module.exports = {
  prisma,
  clearDatabase,
  createTestUser,
  createTestCategory,
  createTestExpense,
};
