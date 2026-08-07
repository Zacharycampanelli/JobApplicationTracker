import { Response } from 'express';
import { prisma } from '../lib/prisma';
import type { AuthRequest } from '../middleware/authMiddleware';
import { parseApplicationPayload } from '../utils/parseApplicationPayload';
import { synchronizeApplicationMilestones } from '../utils/synchronizeApplicationMilestones';

export const getAllApplications = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authorized' });
    }
    const applications = await prisma.jobApplication.findMany({
      where: { userId: req.user.userId },
      select: {
        id: true,
        publicId: true,
        title: true,
        company: true,
        location: true,
        status: true,
        appliedAt: true,
        notes: true,
        link: true,
        resumeId: true,
        source: true,
        workMode: true,
        salaryMin: true,
        salaryMax: true,
        firstResponseAt: true,
        interviewAt: true,
        offerAt: true,
        rejectedAt: true,
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

    const publicId = req.params.id;

    if (typeof publicId !== 'string') {
      return res.status(400).json({ error: 'Invalid application ID' });
    }

    const application = await prisma.jobApplication.findFirst({
      where: {
        publicId,
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

export const getRecentApplications = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authorized' });
    }
    const applications = await prisma.jobApplication.findMany({
      where: { userId: req.user.userId },
      select: {
        id: true,
        publicId: true,
        title: true,
        company: true,
        location: true,
        status: true,
        appliedAt: true,
        notes: true,
        link: true,
        resumeId: true,
        source: true,
        workMode: true,
        salaryMin: true,
        salaryMax: true,
        firstResponseAt: true,
        interviewAt: true,
        offerAt: true,
        rejectedAt: true,
      },
      orderBy: { appliedAt: 'desc' },
      take: 3,
    });
    res.status(200).json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
};

export const createApplication = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authorized' });
    }

    const parsed = parseApplicationPayload(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error });
    }

    let resume = null;
    if (req.body.resumeId) {
      const resumeId = Number(req.body.resumeId);

      if (Number.isNaN(resumeId)) {
        return res.status(400).json({ error: 'Resume ID is not valid' });
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

    const userId = req.user.userId;

    const application = await prisma.$transaction(async (tx) => {
      const app = await tx.jobApplication.create({
        data: {
          ...parsed.data,
          resumeId: resume?.id,
          userId,
        },
      });

      await tx.applicationActivity.create({
        data: {
          type: 'CREATED',
          title: app.title,
          company: app.company,
          userId,
          applicationId: app.id,
        },
      });
      return app;
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

    const publicId = req.params.id;

    if (typeof publicId !== 'string') {
      return res.status(400).json({ error: 'Invalid application ID' });
    }

    const application = await prisma.jobApplication.findFirst({
      where: {
        publicId,
        userId: req.user.userId,
      },
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const parsed = parseApplicationPayload(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error });
    }

    let resume = null;
    if (req.body.resumeId) {
      const resumeId = Number(req.body.resumeId);

      if (Number.isNaN(resumeId)) {
        return res.status(400).json({ error: 'Resume ID is not valid' });
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

    const userId = req.user.userId;

    const updatedApplication = await prisma.$transaction(async (tx) => {
      const updatedApp = await tx.jobApplication.update({
        where: {
          publicId,
        },
        data: {
          ...parsed.data,
          resumeId: resume?.id,
          userId,
        },
      });

      if (updatedApp.status !== application.status) {
        await tx.applicationActivity.create({
          data: {
            type: 'STATUS_CHANGE',
            title: updatedApp.title,
            company: updatedApp.company,
            userId,
            applicationId: updatedApp.id,
            fromStatus: application.status,
            toStatus: updatedApp.status,
          },
        });
      } else {
        await tx.applicationActivity.create({
          data: {
            type: 'UPDATED',
            title: updatedApp.title,
            company: updatedApp.company,
            userId,
            applicationId: updatedApp.id,
          },
        });
      }
      return updatedApp;
    });

    res.status(200).json(updatedApplication);
  } catch (error) {
    console.error('Error updating application:', error);
    res.status(500).json({ error: 'Failed to update application' });
  }
};

export const updateApplicationStatus = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authorized' });
    }

    const publicId = req.params.id;

    if (typeof publicId !== 'string') {
      return res.status(400).json({ error: 'Invalid application ID' });
    }

    const status = req.body.status;

    const allowedStatuses = ['APPLIED', 'INTERVIEW', 'OFFER', 'REJECTED'];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const application = await prisma.jobApplication.findFirst({
      where: {
        publicId,
        userId: req.user.userId,
      },
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const synchronizedData = synchronizeApplicationMilestones(application, status);

    const statusChanged = application.status !== status;

    const milestonesChanged =
      application.firstResponseAt?.getTime() !== synchronizedData.firstResponseAt?.getTime() ||
      application.interviewAt?.getTime() !== synchronizedData.interviewAt?.getTime() ||
      application.offerAt?.getTime() !== synchronizedData.offerAt?.getTime() ||
      application.rejectedAt?.getTime() !== synchronizedData.rejectedAt?.getTime();

    if (!statusChanged && !milestonesChanged) {
      return res.status(200).json(application);
    }

    const userId = req.user.userId;

    const updatedApplication = await prisma.$transaction(async (tx) => {
      const updatedApp = await tx.jobApplication.update({
        where: {
          publicId,
        },
        data: synchronizedData,
      });

      if (statusChanged) {
        await tx.applicationActivity.create({
          data: {
            type: 'STATUS_CHANGE',
            title: updatedApp.title,
            company: updatedApp.company,
            userId,
            applicationId: updatedApp.id,
            fromStatus: application.status,
            toStatus: updatedApp.status,
          },
        });
      }
      return updatedApp;
    });

    res.status(200).json(updatedApplication);
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ error: 'Failed to update application status' });
  }
};

export const deleteApplication = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const publicId = req.params.id;

    if (typeof publicId !== 'string') {
      return res.status(400).json({ error: 'Invalid application ID' });
    }

    const application = await prisma.jobApplication.findFirst({
      where: {
        publicId,
        userId: req.user.userId,
      },
    });
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const userId = req.user.userId;

    const deletedApplication = await prisma.$transaction(async (tx) => {
      await tx.applicationActivity.create({
        data: {
          type: 'DELETED',
          title: application.title,
          company: application.company,
          userId,
          applicationId: application.id,
        },
      });

      const deletedApp = await tx.jobApplication.delete({
        where: {
          publicId,
        },
      });

      return deletedApp;
    });

    res.status(200).json(application);
  } catch (error) {
    console.error('Error deleting application:', error);
    res.status(500).json({ error: 'Failed to delete application' });
  }
};
