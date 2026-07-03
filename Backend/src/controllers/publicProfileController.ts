import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getPublicProfile = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.id);

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
        preferences: {
          is: {
            publicProfileEnabled: true,
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        profile: {
          select: {
            summary: true,
            title: true,
            location: true,
            website: true,
            linkedin: true,
            avatarUrl: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'Public profile not found' });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching public profile:', error);
    return res.status(500).json({ message: 'Failed to fetch public profile' });
  }
};
