const request = require("supertest");
const {
  clearDatabase,
  createTestUser,
  createTestCategory,
} = require("./setup"); // Load setup FIRST to set env vars
const app = require("../app"); // Load app AFTER env vars are set

describe("Categories Endpoints", () => {
  let token;

  beforeEach(async () => {
    await clearDatabase();

    await createTestUser();

    const loginRes = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "password123",
    });

    token = loginRes.body.token;
  });

  describe("POST /api/categories", () => {
    it("should create a new category", async () => {
      const res = await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "Groceries",
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty(
        "message",
        "Category created successfully"
      );
      expect(res.body.category).toHaveProperty("name", "Groceries");
    });

    it("should fail with duplicate name", async () => {
      await createTestCategory("Groceries");

      const res = await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "Groceries",
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty(
        "error",
        "Category with this name already exists."
      );
    });

    it("should fail without authentication", async () => {
      const res = await request(app).post("/api/categories").send({
        name: "Groceries",
      });

      expect(res.status).toBe(401);
    });
  });

  describe("GET /api/categories", () => {
    it("should get all categories", async () => {
      await createTestCategory("Groceries");
      await createTestCategory("Transportation");

      const res = await request(app)
        .get("/api/categories")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("count", 2);
      expect(res.body.categories).toHaveLength(2);
    });
  });

  describe("PUT /api/categories/:id", () => {
    it("should update a category", async () => {
      const category = await createTestCategory("Groceries");

      const res = await request(app)
        .put(`/api/categories/${category.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "Food & Groceries",
        });

      expect(res.status).toBe(200);
      expect(res.body.category).toHaveProperty("name", "Food & Groceries");
    });
  });

  describe("DELETE /api/categories/:id", () => {
    it("should delete a category", async () => {
      const category = await createTestCategory("Groceries");

      const res = await request(app)
        .delete(`/api/categories/${category.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty(
        "message",
        "Category deleted successfully"
      );
    });
  });
});
