import { Response } from "express";

import { prisma } from "../lib/prisma";
import type { AuthRequest } from "../middleware/authMiddleware";

export const updateUser = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { name, summary, title, location, website, linkedin } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { name },
    });

    await prisma.userProfile.upsert({
      where: { userId },
      update: {
        summary,
        title,
        location,
        website,
        linkedin,
      },
      create: {
        userId,
        summary,
        title,
        location,
        website,
        linkedin,
      },
    });

    const updatedUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        profile: {
          select: {
            id: true,
            userId: true,
            summary: true,
            title: true,
            location: true,
            website: true,
            linkedin: true,
            createdAt: true,
            updatedAt: true,
            avatarUrl: true,
          },
        },
        preferences: {
          select: {
            id: true,
            userId: true,
            publicProfileEnabled: true,
            autoStatusUpdatesEnabled: true,
            themePreference: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

export const uploadAvatar = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const avatarUrl = `/uploads/avatars/${req.file?.filename}`;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!req.file) {
    return res.status(400).json({ error: 'Avatar is required' });
  }

  try {
    await prisma.userProfile.upsert({
      where: { userId },
      update: { avatarUrl },
      create: { userId, avatarUrl },
    });

    const updatedUserWithAvatar = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        profile: {
          select: {
            id: true,
            userId: true,
            summary: true,
            title: true,
            location: true,
            website: true,
            linkedin: true,
            createdAt: true,
            updatedAt: true,
            avatarUrl: true,
          },
        },
        preferences: {
          select: {
            id: true,
            userId: true,
            publicProfileEnabled: true,
            autoStatusUpdatesEnabled: true,
            themePreference: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    res.json(updatedUserWithAvatar);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to upload avatar' });
  }
};

export const updateUserPreferences = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { publicProfileEnabled, autoStatusUpdatesEnabled, themePreference } = req.body;

  try {
    const updatedPreferences = await prisma.userPreferences.upsert({
      where: { userId },
      update: {
        publicProfileEnabled,
        autoStatusUpdatesEnabled,
        themePreference,
      },
      create: {
        userId,
        publicProfileEnabled,
        autoStatusUpdatesEnabled,
        themePreference,
      },
    });

    res.json(updatedPreferences);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update user preferences' });
  }
};
