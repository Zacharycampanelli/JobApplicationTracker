import type { Response } from "express";
import { unlink } from "fs/promises";
import { afterEach, expect, it, vi } from "vitest";

import { prisma } from "../lib/prisma";
import type { AuthRequest } from "../middleware/authMiddleware";
import { deleteResume, downloadResume, getResumes, uploadResume } from "./resumeController";

vi.mock("fs/promises", () => ({
    unlink: vi.fn(),
}))

vi.mock("../lib/prisma", () => ({
    prisma: {
        resume: {
            create: vi.fn(),
            delete: vi.fn(),
            findFirst: vi.fn(),
            findMany: vi.fn(),
        },
    }
}))

afterEach(() => {
    vi.resetAllMocks();
});

it("removes the uploaded file when the database save fails", async () => {
    const req = {
        user: { userId: 1, sessionVersion: 0 },
        file: {
            path: "/fake/uploads/resume.pdf",
            originalname: "resume.pdf",
            mimetype: "application/pdf"
        },
    } as AuthRequest;

    const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
    } as unknown as Response;

    vi.mocked(prisma.resume.create).mockRejectedValue(
        new Error("Database unavailable"),
    );

    vi.mocked(unlink).mockResolvedValue(undefined);

    await uploadResume(req, res);

    expect(unlink).toHaveBeenCalledWith(req.file!.path);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
        message: "Failed to upload resume"
    })
})

it("does not delete a resume outside the signed-in user's ownership", async () => {
    const req = {
        user: { userId: 1, sessionVersion: 0 },
        params: { id: "42" }
    } as unknown as AuthRequest;

    const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
    } as unknown as Response;

    vi.mocked(prisma.resume.findFirst).mockResolvedValue(null);

    await deleteResume(req, res);

    expect(prisma.resume.findFirst).toHaveBeenCalledWith({ where: { id: 42, userId: 1 } });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Resume not found" })
    expect(unlink).not.toHaveBeenCalled();
    expect(prisma.resume.delete).not.toHaveBeenCalled()

})

it("does not download a resume outside the signed-in user's ownership", async () => {
    const req = {
        user: { userId: 1, sessionVersion: 0 },
        params: { id: "42" }
    } as unknown as AuthRequest;

    const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
        download: vi.fn(),

    } as unknown as Response;

    vi.mocked(prisma.resume.findFirst).mockResolvedValue(null);

    await downloadResume(req, res);

    expect(prisma.resume.findFirst).toHaveBeenCalledWith({ where: { id: 42, userId: 1 } });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Resume not found" })
    expect(res.download).not.toHaveBeenCalled()
})

it("downloads an owned resume using its original filename", async () => {
     const req = {
        user: { userId: 1, sessionVersion: 0 },
        params: { id: "42" }
    } as unknown as AuthRequest;

    const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
        download: vi.fn(),

    } as unknown as Response;

    vi.mocked(prisma.resume.findFirst).mockResolvedValue({
        id: 42,
        userId: 1,
        fileUrl: "/fake/uploads/resume.pdf",
        name: "My Resume.pdf",
        mimeType: "application/pdf",
        createdAt: new Date("2026-01-01T00:00:00.000Z")
    }) 

    await downloadResume(req, res);

    expect(res.download).toHaveBeenCalledWith("/fake/uploads/resume.pdf", "My Resume.pdf", expect.any(Function));
})

it("returns 404 when the resume file is missing", async () => {
    const req = {
        user: { userId: 1, sessionVersion: 0 },
        params: { id: "42" }
    } as unknown as AuthRequest;

    const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
        download: vi.fn((_path, _name, callback) => {
            callback(Object.assign(new Error("File not found"), {
                code: "ENOENT",
            }))
        }),

    } as unknown as Response;

    vi.mocked(prisma.resume.findFirst).mockResolvedValue({
        id: 42,
        userId: 1,
        fileUrl: "/fake/uploads/resume.pdf",
        name: "My Resume.pdf",
        mimeType: "application/pdf",
        createdAt: new Date("2026-01-01T00:00:00.000Z")
    }) 

    await downloadResume(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Resume file not found" })
})

it("limits the resume list to the signed-in user", async () => {
    const req = {
        user: { userId: 1, sessionVersion: 0 }
    } as AuthRequest;

    const res = {
        json: vi.fn(),
    } as unknown as Response;

    vi.mocked(prisma.resume.findMany).mockResolvedValue([]);

    await getResumes(req, res);

    expect(prisma.resume.findMany).toHaveBeenCalledWith({ where: { userId: 1 } });
    expect(res.json).toHaveBeenCalledWith([]);
})