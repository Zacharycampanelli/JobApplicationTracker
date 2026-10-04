import { unlink } from "node:fs/promises";
import { afterEach, expect, it, vi } from "vitest";

import { prisma } from "../lib/prisma";
import { processFileDeletionTask } from "./fileCleanupService";

vi.mock("node:fs/promises", () => ({
  unlink: vi.fn(),
}));

vi.mock("../lib/prisma", () => ({
  prisma: {
    fileDeletionTask: {
      delete: vi.fn(),
    },
  },
}));

afterEach(() => {
  vi.resetAllMocks();
});

it("keeps the cleanup task when file deletion fails", async () => {
  const task = {
    id: 1,
    filePath: "/fake/uploads/resume.pdf",
  };

  vi.mocked(unlink).mockRejectedValue(new Error("Permission denied"));

  await expect(processFileDeletionTask(task)).rejects.toThrow(
    "Permission denied",
  );

  expect(prisma.fileDeletionTask.delete).not.toHaveBeenCalled();
});