import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { comparePassword, hashPassword } from '../utils/hash';
import { generateToken } from '../utils/generateToken';
import type { AuthRequest } from '../middleware/authMiddleware';
import { sendPasswordResetEmail } from '../services/emailService';
import crypto from 'node:crypto';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }

    if (name.trim().length < 2) {
      return res.status(400).json({ error: 'Name must be at least 2 characters long' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    const token = generateToken(user.id);

    return res.status(201).json({ message: 'User registered successfully', user, token });
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({ error: 'Failed to register user' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordCorrect = await comparePassword(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user.id);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Error logging in:', error);
    return res.status(500).json({ error: 'Failed to login' });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authorized' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
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

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching current user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    if (!req.body.email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    const { email } = req.body;
    //normalize email
    const normalizeEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: normalizeEmail } });
    if (!user) {
      return res.status(200).json({ message: 'If an account exists for that email, a reset link has been sent.' });
    }
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    await prisma.passwordResetToken.create({
      data: {
        tokenHash,
        userId: user.id,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      },
    });

    const resetUrl = `${process.env.DEVELOPMENT_URL}/reset-password?token=${resetToken}`;

    await sendPasswordResetEmail(user.email, resetUrl)

    res.status(200).json({ message: 'If an account exists for that email, a reset link has been sent.' });
  } catch (error) {
    console.error('Error requesting password reset:', error);
    return res.status(500).json({ error: 'Failed to request password reset' });
  }
};


export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ error: 'Token and password are required' });
    }

    if(password.length < 6){
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }
    
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const resetRecord = await prisma.passwordResetToken.findUnique({ where: { tokenHash } });
    if (!resetRecord) {
      return res.status(404).json({ error: 'Invalid or expired reset token' });
    }
    if (resetRecord.expiresAt < new Date()) {
      return res.status(400).json({ error: 'Reset token has expired' });
    }
    const hashedPassword = await hashPassword(password);
    
    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetRecord.userId },
        data: { password: hashedPassword },
      }),
      prisma.passwordResetToken.deleteMany({ where: { userId: resetRecord.userId } }),
    ]);
    return res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Error resetting password:', error);
    return res.status(500).json({ error: 'Failed to reset password' });
  }
};