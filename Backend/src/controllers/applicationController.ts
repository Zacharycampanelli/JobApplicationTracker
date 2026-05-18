import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import type { AuthRequest } from '../middleware/authMiddleware';

export const getAllApplications = async (req: AuthRequest, res: Response) => {
  try {
    console.log(req.user);
    if (!req.user) {
      return res.status(401).json({ error: 'Not authorized' });
    }
    const applications = await prisma.jobApplication.findMany({
      where: { userId: req.user.userId },
      select: {
        id: true,
        title: true,
        company: true,
        status: true,
        appliedAt: true,
        notes: true,
        link: true,
      },
      orderBy: { appliedAt: 'desc' },
    });
    res.status(200).json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
};
