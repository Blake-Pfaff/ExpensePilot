const request = require("supertest");
const {
  clearDatabase,
  createTestUser,
  createTestCategory,
  createTestExpense,
} = require("./setup"); // Load setup FIRST to set env vars
const app = require("../app"); // Load app AFTER env vars are set

describe("Expenses Endpoints", () => {
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

  describe("POST /api/expenses", () => {
    it("should create a new expense", async () => {
      const res = await request(app)
        .post("/api/expenses")
        .set("Authorization", `Bearer ${token}`)
        .send({
          amount: 50.99,
          description: "Groceries",
          type: "expense",
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty(
        "message",
        "Expense created successfully"
      );
      expect(res.body.expense).toHaveProperty("amount", 50.99);
      expect(res.body.expense).toHaveProperty("description", "Groceries");
    });

    it("should create an income", async () => {
      const res = await request(app)
        .post("/api/expenses")
        .set("Authorization", `Bearer ${token}`)
        .send({
          amount: 2500.0,
          description: "Salary",
          type: "income",
        });

      expect(res.status).toBe(201);
      expect(res.body.expense).toHaveProperty("type", "income");
    });

    it("should fail without authentication", async () => {
      const res = await request(app).post("/api/expenses").send({
        amount: 50.99,
        description: "Groceries",
        type: "expense",
      });

      expect(res.status).toBe(401);
    });

    it("should fail with negative amount", async () => {
      const res = await request(app)
        .post("/api/expenses")
        .set("Authorization", `Bearer ${token}`)
        .send({
          amount: -50,
          description: "Invalid",
          type: "expense",
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error", "Validation failed");
    });
  });

  describe("GET /api/expenses", () => {
    it("should get all user expenses", async () => {
      await createTestExpense(userId, { description: "Expense 1" });
      await createTestExpense(userId, { description: "Expense 2" });

      const res = await request(app)
        .get("/api/expenses")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("count", 2);
      expect(res.body.expenses).toHaveLength(2);
    });

    it("should filter by type", async () => {
      await createTestExpense(userId, { type: "expense" });
      await createTestExpense(userId, { type: "income" });

      const res = await request(app)
        .get("/api/expenses?type=expense")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.expenses).toHaveLength(1);
      expect(res.body.expenses[0].type).toBe("expense");
    });
  });

  describe("GET /api/expenses/:id", () => {
    it("should get expense by id", async () => {
      const expense = await createTestExpense(userId);

      const res = await request(app)
        .get(`/api/expenses/${expense.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.expense).toHaveProperty("id", expense.id);
    });

    it("should return 404 for non-existent expense", async () => {
      const res = await request(app)
        .get("/api/expenses/99999")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
    });
  });

  describe("PUT /api/expenses/:id", () => {
    it("should update an expense", async () => {
      const expense = await createTestExpense(userId);

      const res = await request(app)
        .put(`/api/expenses/${expense.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          amount: 75.5,
          description: "Updated Expense",
        });

      expect(res.status).toBe(200);
      expect(res.body.expense).toHaveProperty("amount", 75.5);
      expect(res.body.expense).toHaveProperty("description", "Updated Expense");
    });
  });

  describe("DELETE /api/expenses/:id", () => {
    it("should delete an expense", async () => {
      const expense = await createTestExpense(userId);

      const res = await request(app)
        .delete(`/api/expenses/${expense.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty(
        "message",
        "Expense deleted successfully"
      );
    });
  });
});
