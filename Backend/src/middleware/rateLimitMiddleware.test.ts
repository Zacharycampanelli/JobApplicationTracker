import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";

import { authRateLimiter } from "./rateLimitMiddleware";

const app = express();

app.set("trust proxy", 1);
app.get("/test", authRateLimiter, (_req, res) => {
  res.sendStatus(200);
});

describe("authRateLimiter", () => {
  it("blocks request 21 within the rate-limit window", async () => {
    const limit = 20;

    for (let attempt = 1; attempt <= limit; attempt++) {
      const response = await request(app).get("/test");

      expect(response.status).toBe(200);
    }

    const blockedResponse = await request(app).get("/test");

    expect(blockedResponse.status).toBe(429);
    expect(blockedResponse.body).toEqual({
      error: "Too many authentication attempts. Please try again later.",
    });
  });
});
