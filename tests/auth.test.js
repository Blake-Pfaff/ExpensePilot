const request = require("supertest");
const { clearDatabase, createTestUser } = require("./setup"); // Load setup FIRST to set env vars
const app = require("../app"); // Load app AFTER env vars are set

describe("Authentication Endpoints", () => {
  // Clear database before each test
  beforeEach(async () => {
    await clearDatabase();
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user successfully", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty(
        "message",
        "User registered successfully"
      );
      expect(res.body).toHaveProperty("user");
      expect(res.body.user).toHaveProperty("email", "john@example.com");
      expect(res.body).toHaveProperty("token");
      expect(res.body.user).not.toHaveProperty("password");
    });

    it("should fail with invalid email", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "John Doe",
        email: "invalid-email",
        password: "password123",
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error", "Validation failed");
    });

    it("should fail with short password", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "John Doe",
        email: "john@example.com",
        password: "12345",
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error", "Validation failed");
    });

    it("should fail if email already exists", async () => {
      await createTestUser({ email: "john@example.com" });

      const res = await request(app).post("/api/auth/register").send({
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty(
        "error",
        "User with this email already exists."
      );
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login successfully with correct credentials", async () => {
      await createTestUser({
        email: "john@example.com",
        password: "password123",
      });

      const res = await request(app).post("/api/auth/login").send({
        email: "john@example.com",
        password: "password123",
      });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("message", "Login successful");
      expect(res.body).toHaveProperty("token");
      expect(res.body.user).not.toHaveProperty("password");
    });

    it("should fail with incorrect password", async () => {
      await createTestUser({
        email: "john@example.com",
        password: "password123",
      });

      const res = await request(app).post("/api/auth/login").send({
        email: "john@example.com",
        password: "wrongpassword",
      });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("error", "Invalid email or password.");
    });

    it("should fail with non-existent email", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "nonexistent@example.com",
        password: "password123",
      });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("error", "Invalid email or password.");
    });
  });

  describe("GET /api/auth/me", () => {
    it("should return user profile with valid token", async () => {
      const user = await createTestUser();

      const loginRes = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "password123",
      });

      const token = loginRes.body.token;

      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("user");
      expect(res.body.user.email).toBe("test@example.com");
    });

    it("should fail without token", async () => {
      const res = await request(app).get("/api/auth/me");

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty(
        "error",
        "No token provided. Access denied."
      );
    });

    it("should fail with invalid token", async () => {
      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", "Bearer invalid-token");

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("error", "Invalid token.");
    });
  });
});
