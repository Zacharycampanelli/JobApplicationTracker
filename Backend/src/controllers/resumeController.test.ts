import type { Response } from "express";
import { unlink } from "fs/promises";
import { afterEach, expect, it, vi } from "vitest";

import { prisma } from "../lib/prisma";
import type { AuthRequest } from "../middleware/authMiddleware";
import { uploadResume } from "./resumeController";

vi.mock("fs/promises", () => ({
    unlink: vi.fn(),
}))

vi.mock("../lib/prisma", () => ({
    prisma: {
        resume: {
            create: vi.fn(),
        },
    }
}))

afterEach(() => {
    vi.resetAllMocks();
});

it("removes the uploaded file when the database save fails", async () => {
  const req = { 
    user: { userId: 1, sessionVersion: 0},
    file: {
        path: "/fake/uploads/resume.pdf",
        originalname: "resume.pdf",
        mimetype: "application/pdf"
    },
  }  as AuthRequest;

  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  } as unknown as Response;

  vi.mocked(prisma.resume.create).mockRejectedValue(
    new Error("Database unavailable"),
  );

  vi.mocked(unlink).mockResolvedValue(undefined);

  await uploadResume(req,res);

  expect(unlink).toHaveBeenCalledWith(req.file!.path);
  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith({
    message: "Failed to upload resume"
  })
})