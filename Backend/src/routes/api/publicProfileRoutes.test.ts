import request from "supertest";
import { afterEach, describe, expect, it, vi } from "vitest";

import app from "../../app";

const { findUniqueMock } = vi.hoisted(() => ({
  findUniqueMock: vi.fn(),
}));

vi.mock("../../lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: findUniqueMock,
    },
  },
}));

afterEach(() => {
  findUniqueMock.mockReset();
});

describe("GET /api/public/profiles/:id", () => {
  it("returns a public profile without the account email", async () => {
    findUniqueMock.mockResolvedValue({
      id: 1,
      name: "Public User",
      profile: {
        summary: "Profile summary",
        title: "Developer",
        location: "New York",
        website: null,
        linkedin: null,
        avatarUrl: null,
      },
    });

    const response = await request(app).get("/api/public/profiles/1");

    expect(response.status).toBe(200);
    expect(response.body).not.toHaveProperty("email");

    const [query] = findUniqueMock.mock.calls[0];
    expect(query.select).not.toHaveProperty("email");
  });
});
