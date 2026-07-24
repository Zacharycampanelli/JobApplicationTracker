import { Response } from 'express';
import { prisma } from '../lib/prisma';
import type { AuthRequest } from '../middleware/authMiddleware';

export const getUserRecentActivities = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const userId = req.user.userId;

  try {
    const activities = await prisma.applicationActivity.findMany({
      where: {
        userId,
      },
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json(activities);
  } catch (error) {
    console.error('Error fetching user recent activities:', error);
    res.status(500).json({ error: 'Failed to fetch user recent activities' });
  }
};
