const request = require("supertest");
const express = require("express");
const app = express();

const bcrypt = require("bcryptjs");

jest.mock("bcryptjs", () => ({
  hashSync: jest.fn(() => "mockHashedPassword"),
  compare: jest.fn((plain, hashed) => plain === "Test@1234" && hashed === "mockHashedPassword"),
}));

// Mock DB connection
jest.mock("../config/db", () => {
  const mPool = {
    getConnection: jest.fn().mockResolvedValue({
      beginTransaction: jest.fn(),
      query: jest.fn(),
      commit: jest.fn(),
      rollback: jest.fn(),
      release: jest.fn(),
    }),
  };
  return mPool;
});

// Mock model functions
jest.mock("../models/userModel", () => ({
  register: jest.fn().mockResolvedValue(1),
  findByEmail: jest.fn((email) => {
    if (email === "test@example.com") {
      return Promise.resolve({
        id: 1,
        username: "testuser",
        email: "test@example.com",
        password: "mockHashedPassword",
      });
    }
    return Promise.resolve(null);
  }),
}));

const { registerUser, loginUser } = require("../controllers/userController");

app.use(express.json());
app.post("/api/user/register", registerUser);
app.post("/api/user/login", loginUser);

describe("User Registration", () => {
  it("should return 400 if fields are missing", async () => {
    const res = await request(app).post("/api/user/register").send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toMatch(/required fields/i);
  });

  it("should handle registration errors", async () => {
    const { register } = require("../models/userModel");
    register.mockRejectedValueOnce(new Error("DB Error"));
    const res = await request(app).post("/api/user/register").send({
      username: "testuser",
      email: "test@example.com",
      password: "Test@1234",
    });
    expect(res.statusCode).toBe(500);
    expect(res.body.msg).toMatch(/server error/i);
  });
});

describe("User Login", () => {
  it("should return 400 if email or password is missing", async () => {
    const res = await request(app).post("/api/user/login").send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/email and password/i);
  });

  it("should return 401 if user not found", async () => {
    const res = await request(app).post("/api/user/login").send({
      email: "nouser@example.com",
      password: "Test@1234",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch("User not found");
  });

  it("should login successfully with correct credentials", async () => {
    const res = await request(app).post("/api/user/login").send({
      email: "test@example.com",
      password: "Test@1234",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Login successful");
    expect(res.body.user).toHaveProperty("username", "testuser");
  });

  it("should handle login errors", async () => {
    const { findByEmail } = require("../models/userModel");
    findByEmail.mockRejectedValueOnce(new Error("DB Error"));
    const res = await request(app).post("/api/user/login").send({
      email: "test@example.com",
      password: "Test@1234",
    });
    expect(res.statusCode).toBe(500);
    expect(res.body.message).toMatch(/server error/i);
  });
});
