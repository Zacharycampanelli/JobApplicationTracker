import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import type { AuthRequest } from '../middleware/authMiddleware';


export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
}

export const updateUser = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;

  if(!userId){
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { name } = req.body;

  if(!name){
    return res.status(400).json({ error: 'Name is required' });
  }

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { name },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update user' });
  }
}