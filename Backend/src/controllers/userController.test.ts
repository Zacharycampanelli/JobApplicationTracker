import type { Response } from "express";
import { unlink } from "node:fs/promises";
import { afterEach, expect, it, vi } from "vitest";

import { prisma } from "../lib/prisma";
import type { AuthRequest } from "../middleware/authMiddleware";
import { uploadAvatar } from "./userController";

vi.mock("node:fs/promises", () => ({
  unlink: vi.fn(),
}));

vi.mock("../lib/prisma", () => ({
  prisma: {
    userProfile: {
      upsert: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
    },
  },
}));

afterEach(() => {
  vi.resetAllMocks();
});

it("removes the new avatar when the database save fails", async () => {
  const req = {
    user: { userId: 1, sessionVersion: 0 },
    file: {
      path: "/fake/uploads/avatars/avatar.png",
      filename: "avatar.png",
    },
  } as AuthRequest;

  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  } as unknown as Response;

  vi.mocked(prisma.userProfile.upsert).mockRejectedValue(new Error("Database unavailable"));
  vi.mocked(unlink).mockRejectedValue(undefined);

  await uploadAvatar(req, res);

  expect(unlink).toHaveBeenCalledWith(req.file!.path);
  expect(prisma.user.findUnique).not.toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith({ error: "Failed to upload avatar" });
});

it("keeps the saved avatar when the user lookup fails", async () => {
  const req = {
    user: { userId: 1, sessionVersion: 0 },
    file: {
      path: "/fake/uploads/avatars/avatar.png",
      filename: "avatar.png",
    },
  } as AuthRequest;

  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  } as unknown as Response;

  vi.mocked(prisma.userProfile.upsert).mockResolvedValue({} as Awaited<ReturnType<typeof prisma.userProfile.upsert>>);

  vi.mocked(prisma.user.findUnique).mockRejectedValue(new Error("User lookup failed"));

  await uploadAvatar(req, res);

  expect(prisma.userProfile.upsert).toHaveBeenCalled();
  expect(prisma.user.findUnique).toHaveBeenCalled();
  expect(unlink).not.toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(500);
});
