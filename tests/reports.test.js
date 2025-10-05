const request = require("supertest");
const {
  clearDatabase,
  createTestUser,
  createTestCategory,
  createTestExpense,
} = require("./setup"); // Load setup FIRST to set env vars
const app = require("../app"); // Load app AFTER env vars are set

describe("Reports Endpoints", () => {
  let token;
  let userId;

  beforeEach(async () => {
    await clearDatabase();

    const user = await createTestUser();
    userId = user.id;

    const loginRes = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "password123",
    });

    token = loginRes.body.token;
  });

  describe("GET /api/reports/monthly", () => {
    it("should return monthly report", async () => {
      await createTestExpense(userId, { amount: 100, type: "income" });
      await createTestExpense(userId, { amount: 50, type: "expense" });

      const res = await request(app)
        .get("/api/reports/monthly")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("summary");
      expect(res.body.summary).toHaveProperty("totalIncome", 100);
      expect(res.body.summary).toHaveProperty("totalExpenses", 50);
      expect(res.body.summary).toHaveProperty("netSavings", 50);
    });

    it("should filter by year and month", async () => {
      const date = new Date("2025-01-15");
      await createTestExpense(userId, { amount: 100, date });

      const res = await request(app)
        .get("/api/reports/monthly?year=2025&month=1")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.period.year).toBe(2025);
      expect(res.body.period.month).toBe(1);
    });
  });

  describe("GET /api/reports/category", () => {
    it("should return category report", async () => {
      const category = await createTestCategory("Groceries");
      await createTestExpense(userId, {
        amount: 50,
        type: "expense",
        categoryId: category.id,
      });
      await createTestExpense(userId, {
        amount: 30,
        type: "expense",
        categoryId: category.id,
      });

      const res = await request(app)
        .get("/api/reports/category")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("summary");
      expect(res.body.summary.totalExpenses).toBe(80);
      expect(res.body.categories).toHaveLength(1);
      expect(res.body.categories[0].category).toBe("Groceries");
      expect(res.body.categories[0].totalAmount).toBe(80);
    });
  });
});
