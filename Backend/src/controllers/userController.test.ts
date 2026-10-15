import type { Response } from "express";
import { unlink } from "node:fs/promises";
import path from "node:path"
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
      findUnique: vi.fn(),
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
  vi.mocked(unlink).mockResolvedValue(undefined);
  vi.mocked(prisma.userProfile.findUnique).mockResolvedValue(null);

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

  vi.mocked(prisma.userProfile.upsert).mockResolvedValue({} as Awaited<ReturnType<typeof prisma.userProfile.upsert>>)
  vi.mocked(prisma.user.findUnique).mockRejectedValue(new Error("User lookup failed"));
  vi.mocked(prisma.userProfile.findUnique).mockResolvedValue(null);

  await uploadAvatar(req, res);

  expect(prisma.userProfile.upsert).toHaveBeenCalled();
  expect(prisma.user.findUnique).toHaveBeenCalled();
  expect(unlink).not.toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(500);
});

it("deletes the old avatar when a new one is uploaded", async () => {
  const req = {
    user: { userId: 1, sessionVersion: 0 },
    file: {
      path: "/fake/uploads/avatars/new.png",
      filename: "new.png",
    },
  } as AuthRequest;

  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  } as unknown as Response;

  vi.mocked(prisma.userProfile.findUnique).mockResolvedValue({
    avatarUrl: "/uploads/avatars/old.png",
  } as Awaited<ReturnType<typeof prisma.userProfile.findUnique>>);

  vi.mocked(prisma.userProfile.upsert).mockResolvedValue(
  {} as Awaited<ReturnType<typeof prisma.userProfile.upsert>>,
);

  vi.mocked(unlink).mockResolvedValue(undefined);
  vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

  await uploadAvatar(req, res);

  expect(
    vi.mocked(prisma.userProfile.upsert).mock.invocationCallOrder[0],
  ).toBeLessThan(
    vi.mocked(unlink).mock.invocationCallOrder[0],
  );

  expect(unlink).toHaveBeenCalledExactlyOnceWith(path.join(process.cwd(), "uploads", "avatars", "old.png"));
  expect(res.json).toHaveBeenCalled()
  expect(res.status).not.toHaveBeenCalledWith(500)
});
