import { Response } from "express";
import { unlink } from "fs/promises";
import path from "node:path";

import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middleware/authMiddleware";

export const uploadResume = async (req: AuthRequest, res: Response) => {
  let resumeSaved = false;

  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (!req.user?.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const resume = await prisma.resume.create({
      data: {
        fileUrl: req.file.path,
        name: req.file.originalname,
        userId: req.user.userId,
        mimeType: req.file.mimetype,
      },
    });
    resumeSaved = true;
    res.json(resume);
  } catch (error) {
    console.error("Failed to upload resume:", error);

    if (req.file && !resumeSaved) {
      try {
        await unlink(req.file.path);
      } catch (cleanupError) {
        console.error("Failed to remove unsaved resume file:", cleanupError);
      }
    }

    res.status(500).json({ message: "Failed to upload resume" });
  }
};

export const getResumes = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const resumes = await prisma.resume.findMany({
      where: {
        userId: req.user.userId,
      },
    });
    res.json(resumes);
  } catch (error) {
    console.error("Failed to get resumes:", error);
    res.status(500).json({ message: "Failed to get resumes" });
  }
};

export const deleteResume = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const resume = await prisma.resume.findFirst({
      where: {
        id,
        userId: req.user.userId,
      },
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    await prisma.resume.delete({
      where: {
        id,
      },
    });

    try {
      await unlink(resume.fileUrl);
    } catch (error) {
      if (typeof error === "object" && error !== null && "code" in error && error.code !== "ENOENT") {
        console.error("Failed to delete resume file:", error);
      }
    }
    res.json(resume);
  } catch (error) {
    if (error instanceof Error && error.message.includes("does not exist")) {
      return res.status(404).json({ message: "Resume not found" });
    }
    res.status(500).json({ message: "Failed to delete resume" });
  }
};

export const previewResume = async (req: AuthRequest, res: Response) => {
  try {
    if(!req.user?.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const id = Number(req.params.id);

    if(!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const resume = await prisma.resume.findFirst({
      where: {
        id,
        userId: req.user.userId,
      },
    });

    if(!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

   if(resume.mimeType !== "application/pdf") {
    return res.status(415).json({
      message: "Preview is only available for PDF files"
    });
   }

   res.setHeader("Content-Type", "application/pdf");
   res.setHeader("Content-Disposition", "inline");
   
   res.sendFile(path.resolve(resume.fileUrl), (error) => {
    if(!error) return;
    if(res.headersSent) return;

    if("code" in error && error.code === "ENOENT") {
      return res.status(404).json({
        message: "Resume file not found"
      })
    }

    console.error("Failed to send resume preview:", error);
    res.status(500).json({ message: "Failed to preview resume" });
   });

  } catch (error) {
    console.error("Failed to preview resume:", error);
    res.status(500).json({ message: "Failed to preview resume" });
  }
}

export const downloadResume = async (req: AuthRequest, res: Response) => {
  try {
    if(!req.user?.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const id = Number(req.params.id);

    if(!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const resume = await prisma.resume.findFirst({
      where: {
        id,
        userId: req.user.userId,
      },
    });

    if(!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.download(resume.fileUrl, resume.name, (error) => {
      if(!error) return;

      if(res.headersSent) return;

      if("code" in error && error.code === "ENOENT") {
        return res.status(404).json({ message: "Resume file not found" });
      }

      console.error("Failed to send resume file:", error);
      res.status(500).json({ message: "Failed to download resume"})
    });
  } catch (error) {
    console.error("Failed to download resume:", error);
    res.status(500).json({ message: "Failed to download resume" });
  }
}