import { Response } from 'express';
import { prisma } from '../lib/prisma';
import type { AuthRequest } from '../middleware/authMiddleware';

export const getAllApplications = async (req: AuthRequest, res: Response) => {
  try {
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
        resumeId: true,
      },
      orderBy: { appliedAt: 'desc' },
    });
    res.status(200).json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
};

export const getSingleApplication = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID' });
    }

    const application = await prisma.jobApplication.findFirst({
      where: {
        id,
        userId: req.user.userId,
      },
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.status(200).json(application);
  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).json({ error: 'Failed to fetch application' });
  }
};

export const createApplication = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authorized' });
    }
    const { title, company, status, appliedAt, notes, link } = req.body;

    if (!title || !company || !status) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const allowedStatuses = ['APPLIED', 'INTERVIEW', 'OFFER', 'REJECTED'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const parsedAppliedAt = appliedAt ? new Date(appliedAt) : undefined;
    if (parsedAppliedAt && isNaN(parsedAppliedAt.getTime())) {
      return res.status(400).json({ error: 'Invalid applied date' });
    }

    let resume = null;
    if (req.body.resumeId) {
      const resumeId = Number(req.body.resumeId);

      if (Number.isNaN(resumeId)) {
        res.status(400).json({ error: 'Resume ID is not valid' });
      }

      resume = await prisma.resume.findFirst({
        where: {
          id: resumeId,
          userId: req.user.userId,
        },
      });
      if (!resume) {
        return res.status(404).json({ error: 'Resume not found' });
      }
    }

    const application = await prisma.jobApplication.create({
      data: {
        title,
        company,
        status,
        appliedAt: parsedAppliedAt,
        notes,
        link,
        resumeId: resume?.id,
        userId: req.user.userId,
      },
    });
    res.status(201).json(application);
  } catch (error) {
    console.error('Error creating application:', error);
    res.status(500).json({ error: 'Failed to create application' });
  }
};

export const updateApplication = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authorized' });
    }
    const { title, company, status, appliedAt, notes, link } = req.body;

    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const application = await prisma.jobApplication.findFirst({
      where: {
        id,
        userId: req.user.userId,
      },
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    if (!title || !company || !status) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const allowedStatuses = ['APPLIED', 'INTERVIEW', 'OFFER', 'REJECTED'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const parsedAppliedAt = appliedAt ? new Date(appliedAt) : undefined;
    if (parsedAppliedAt && isNaN(parsedAppliedAt.getTime())) {
      return res.status(400).json({ error: 'Invalid applied date' });
    }

    let resume = null;
    if (req.body.resumeId) {
      const resumeId = Number(req.body.resumeId);

      if (Number.isNaN(resumeId)) {
        res.status(400).json({ error: 'Resume ID is not valid' });
      }

      resume = await prisma.resume.findFirst({
        where: {
          id: resumeId,
          userId: req.user.userId,
        },
      });
      if (!resume) {
        return res.status(404).json({ error: 'Resume not found' });
      }
    }

    const updatedApplication = await prisma.jobApplication.update({
      where: {
        id,
      },
      data: {
        title,
        company,
        status,
        appliedAt: parsedAppliedAt,
        notes,
        link,
        resumeId: resume?.id,
        userId: req.user.userId,
      },
    });
    res.status(200).json(updatedApplication);
  } catch (error) {
    console.error('Error updating application:', error);
    res.status(500).json({ error: 'Failed to update application' });
  }
};

export const deleteApplication = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid application ID' });
    }

    const application = await prisma.jobApplication.findFirst({
      where: {
        id: id,
        userId: req.user.userId,
      },
    });
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }
    await prisma.jobApplication.delete({
      where: {
        id,
      },
    });

    res.status(200).json(application);
  } catch (error) {
    console.error('Error deleting application:', error);
    res.status(500).json({ error: 'Failed to delete application' });
  }
};
