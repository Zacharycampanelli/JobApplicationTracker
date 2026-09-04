import { Response } from "express";
import { unlink } from "fs/promises";

import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middleware/authMiddleware";

export const uploadResume = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    if (!req.user?.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const resume = await prisma.resume.create({
      data: {
        fileUrl: req.file.path,
        name: req.file.originalname,
        userId: req.user.userId,
        mimeType: req.file.mimetype
      },
    });
    res.json(resume);
  } catch (error) {
    console.error('Failed to upload resume:', error);
    res.status(500).json({ message: 'Failed to upload resume' });
  }
};

export const getResumes = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const resumes = await prisma.resume.findMany({
      where: {
        userId: req.user.userId,
      },
    });
    res.json(resumes);
  } catch (error) {
    console.error('Failed to get resumes:', error);
    res.status(500).json({ message: 'Failed to get resumes' });
  }
};

export const deleteResume = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID' });
    }

    const resume = await prisma.resume.findFirst({
      where: {
        id,
        userId: req.user.userId,
      },
    });

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    await prisma.resume.delete({
      where: {
        id,
      },
    });

    try {
      await unlink(resume.fileUrl);
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'code' in error && error.code !== 'ENOENT') {
        console.error('Failed to delete resume file:', error);
      }
    }
    res.json(resume);
  } catch (error) {
    if (error instanceof Error && error.message.includes('does not exist')) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    res.status(500).json({ message: 'Failed to delete resume' });
  }
};
