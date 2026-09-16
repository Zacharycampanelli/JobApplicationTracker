import jwt from "jsonwebtoken";
import request from "supertest";
import { afterEach, describe, expect, it, vi } from "vitest";

import app from "../../app";
import { prisma } from "../../lib/prisma";
import { generateToken } from "../../utils/generateToken";
import { comparePassword, hashPassword } from "../../utils/hash";

afterEach(() => {
  vi.resetAllMocks();
  vi.restoreAllMocks();
});

vi.mock("../../services/emailService", () => ({
  sendPasswordResetEmail: vi.fn(),
}));

vi.mock("../../lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    passwordResetToken: {
      findUnique: vi.fn(),
      deleteMany: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

vi.mock("../../utils/hash", () => ({
  comparePassword: vi.fn(),
  hashPassword: vi.fn(),
}));

vi.mock("../../utils/generateToken", () => ({
  generateToken: vi.fn(),
}));

vi.mock("jsonwebtoken", async (importOriginal) => {
  const actual = await importOriginal<{ default: typeof jwt }>();

  return {
    ...actual,
    default: {
      ...actual.default,
      verify: vi.fn(),
    },
  };
});

describe("Authentication payload validation", () => {
  it.each([
    {
      description: "password is an array",
      endpoint: "/api/auth/register",
      body: { name: "Test User", email: "user@example.com", password: ["password"] },
      expectedError: "Name, email and password are required",
    },
    {
      description: "email is a number",
      endpoint: "/api/auth/login",
      body: { email: 8888888888, password: "passwordfifteen" },
      expectedError: "Email and password are required",
    },
    {
      description: "email is an object",
      endpoint: "/api/auth/forgot-password",
      body: { email: {} },
      expectedError: "Email is required",
    },
    {
      description: "password is null",
      endpoint: "/api/auth/reset-password",
      body: { token: "valid-token", password: null },
      expectedError: "Token and password are required",
    },
  ])("returns 400 for $description", async ({ endpoint, body, expectedError }) => {
    const response = await request(app).post(endpoint).send(body);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: expectedError });
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
  });
});

describe("POST /api/auth/register", () => {
  it("Expects a password with minimum length of 15 characters", async () => {
    const body = { name: "Test User", email: "user1@example.com", password: "shortat14chars" };

    const response = await request(app).post("/api/auth/register").send(body);

    expect(response.status).toBe(400);
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
    expect(response.body).toEqual({ error: "Password must be at least 15 characters long" });
  });
});

describe("POST /api/auth/login", () => {
  it.each([
    {
      description: "an empty body",
      body: {},
    },
    {
      description: "missing password",
      body: { email: "user1@example.com" },
    },
    {
      description: "missing email",
      body: { password: "password1!" },
    },
  ])("returns 400 for $description", async ({ body }) => {
    const response = await request(app).post("/api/auth/login").send(body);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Email and password are required" });
  });

  it("returns 401 for invalid credentials", async () => {
    const body = {
      email: "user1@example.com",
      password: "password1!",
    };

    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    const response = await request(app).post("/api/auth/login").send(body);

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: "Invalid credentials" });
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: {
        email: body.email,
      },
    });
  });

  it("returns 401 when the password is incorrect", async () => {
    const body = { email: "user1@example.com", password: "wrong-password" };

    const user = {
      id: 1,
      email: "user1@example.com",
      password: "stored-password-hash",
      name: "User 1",
      createdAt: new Date("2026-01-01"),
      updatedAt: new Date("2026-01-01"),
      sessionVersion: 3,
    };

    vi.mocked(prisma.user.findUnique).mockResolvedValue(user);
    vi.mocked(comparePassword).mockResolvedValue(false);

    const response = await request(app).post("/api/auth/login").send(body);

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: "Invalid credentials" });
    expect(comparePassword).toHaveBeenCalledWith(body.password, user.password);
  });

  it("returns the authenticated user and token for valid credentials", async () => {
    const body = { email: "user1@example.com", password: "password1!" };

    const user = {
      id: 1,
      email: "user1@example.com",
      password: "password1!",
      name: "User 1",
      createdAt: new Date("2026-01-01"),
      updatedAt: new Date("2026-01-01"),
      sessionVersion: 3,
    };

    const token = "abc123";

    vi.mocked(prisma.user.findUnique).mockResolvedValue(user);
    vi.mocked(comparePassword).mockResolvedValue(true);
    vi.mocked(generateToken).mockReturnValue(token);

    const response = await request(app).post("/api/auth/login").send(body);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt.toISOString(),
      },
    });
    expect(generateToken).toHaveBeenCalledWith(user.id, user.sessionVersion);
  });

  it("returns 500 when the user lookup fails", async () => {
    const body = {
      email: "user1@example.com",
      password: "password1!",
    };

    const databaseError = new Error("Database unavailable");

    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    vi.mocked(prisma.user.findUnique).mockRejectedValue(databaseError);

    const response = await request(app).post("/api/auth/login").send(body);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Failed to login" });
    expect(consoleErrorSpy).toHaveBeenCalledWith("Error logging in:", databaseError);
  });

  it("normalizes email with uppercase before logging in", async () => {
    const body = { email: " User1@Example.Com ", password: "password1!" };

    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    const response = await request(app).post("/api/auth/login").send(body);

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: "Invalid credentials" });
    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: "user1@example.com" } });
  });
});

describe("GET /api/auth/me", () => {
  it("returns 401 when no authorization token is provided", async () => {
    const response = await request(app).get("/api/auth/me");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      error: "Not authorized, no token provided",
    });
  });

  it("returns 401 when an invalid authorization token is provided", async () => {
    vi.mocked(jwt.verify).mockImplementation(() => {
      throw new jwt.JsonWebTokenError("jwt malformed");
    });
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const response = await request(app).get("/api/auth/me").set("Authorization", "Bearer invalid-token");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: "Not authorized, token failed" });
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  it("returns 401 when the authenticated user no longer exists", async () => {
    vi.mocked(jwt.verify).mockImplementation(() => ({ userId: 1, sessionVersion: 0 }));
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    const response = await request(app).get("/api/auth/me").set("Authorization", "Bearer valid-token");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: "Not authorized, user not found" });
    expect(prisma.user.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 1 },
      }),
    );
  });

  it("returns the authenticated user", async () => {
    vi.mocked(jwt.verify).mockImplementation(() => ({ userId: 1, sessionVersion: 0 }));
    const user = {
      id: 1,
      name: "User 1",
      email: "user1@example.com",
      createdAt: new Date("2026-01-01"),
      updatedAt: new Date("2026-01-02"),
      profile: null,
      preferences: null,
    };
    vi.mocked(prisma.user.findUnique)
      .mockResolvedValueOnce({ sessionVersion: 0 } as never)
      .mockResolvedValueOnce(user as never);

    const response = await request(app).get("/api/auth/me").set("Authorization", "Bearer valid-token");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      profile: user.profile,
      preferences: user.preferences,
    });
    expect(prisma.user.findUnique).toHaveBeenCalledWith(expect.objectContaining({ where: { id: 1 } }));
  });

  it("returns 500 when user lookup fails", async () => {
    vi.mocked(jwt.verify).mockImplementation(() => ({ userId: 1, sessionVersion: 0 }));
    const databaseError = new Error("Error fetching current user");
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    vi.mocked(prisma.user.findUnique)
      .mockResolvedValueOnce({ sessionVersion: 0 } as never)
      .mockRejectedValueOnce(databaseError);

    const response = await request(app).get("/api/auth/me").set("Authorization", "Bearer valid-token");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Failed to fetch user" });
    expect(consoleErrorSpy).toHaveBeenCalledWith("Error fetching current user:", databaseError);
  });

  it("returns 401 when the session version no longer matches", async () => {
    vi.mocked(jwt.verify).mockImplementation(() => ({ userId: 1, sessionVersion: 0 }));
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({ sessionVersion: 1 } as never);

    const response = await request(app).get("/api/auth/me").set("Authorization", "Bearer valid-token");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: "Not authorized, session has expired" });
    expect(prisma.user.findUnique).toHaveBeenCalledTimes(1);
  });
});

describe("POST /api/auth/reset-password", () => {
  it("updates the password and increments the session version", async () => {
    const body = {
      token: "token-123",
      password: "new-password-12345!",
    };

    vi.mocked(prisma.passwordResetToken.findUnique).mockResolvedValue({
      id: 1,
      userId: 1,
      tokenHash: "stored-token-hash",
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    });

    vi.mocked(hashPassword).mockResolvedValue("new-password-hash!");

    vi.mocked(prisma.$transaction).mockResolvedValue([]);
    const response = await request(app).post("/api/auth/reset-password").send(body);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Password reset successful" });
    expect(hashPassword).toHaveBeenCalledWith(body.password);
    expect(prisma.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 1 },
        data: {
          password: "new-password-hash!",
          sessionVersion: { increment: 1 },
        },
      }),
    );
    expect(prisma.passwordResetToken.deleteMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: 1 },
      }),
    );
  });
});
