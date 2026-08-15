import { describe, expect, test } from "vitest";

import { synchronizeApplicationMilestones } from "./synchronizeApplicationMilestones";

describe('synchronizeApplicationMilestones', () => {
  test('APPLIED clears every milestone date', () => {
    // Arrange
    const application = {
      firstResponseAt: new Date('2026-07-05'),
      interviewAt: new Date('2026-07-10'),
      offerAt: new Date('2026-07-15'),
      rejectedAt: new Date('2026-07-20'),
    };

    // Act
    const result = synchronizeApplicationMilestones(application, 'APPLIED');

    // Assert
    expect(result).toEqual({
      status: 'APPLIED',
      firstResponseAt: null,
      interviewAt: null,
      offerAt: null,
      rejectedAt: null,
    });
  });

  test('INTERVIEW supplies now when no response exists', () => {
    // Arrange
    const application = {
      firstResponseAt: null,
      interviewAt: null,
      offerAt: null,
      rejectedAt: null,
    };

    const now = new Date('2026-07-20T12:00:00.000Z');
    // Act
    const result = synchronizeApplicationMilestones(application, 'INTERVIEW', now);

    // Assert
    expect(result).toEqual({
      status: 'INTERVIEW',
      firstResponseAt: now,
      interviewAt: null,
      offerAt: null,
      rejectedAt: null,
    });
  });

  test('INTERVIEW retains an existing response', () => {
    // Arrange
    const existingResponse = new Date('2026-07-10T12:00:00.000Z');
    const existingInterview = new Date('2026-07-15T12:00:00.000Z');

    const application = {
      firstResponseAt: existingResponse,
      interviewAt: existingInterview,
      offerAt: new Date('2026-07-18T12:00:00.000Z'),
      rejectedAt: new Date('2026-07-19T12:00:00.000Z'),
    };

    // Act
    const result = synchronizeApplicationMilestones(application, 'INTERVIEW');

    // Assert
    expect(result).toEqual({
      status: 'INTERVIEW',
      firstResponseAt: existingResponse,
      interviewAt: existingInterview,
      offerAt: null,
      rejectedAt: null,
    });
  });

  test('OFFER supplies now when no response exists', () => {
    // Arrange
    const application = {
      firstResponseAt: null,
      interviewAt: new Date('2026-07-15T12:00:00.000Z'),
      offerAt: null,
      rejectedAt: new Date('2026-07-18T12:00:00.000Z'),
    };

    const now = new Date('2026-07-20T12:00:00.000Z');
    // Act
    const result = synchronizeApplicationMilestones(application, 'OFFER', now);

    // Assert
    expect(result).toEqual({
      status: 'OFFER',
      firstResponseAt: now,
      interviewAt: application.interviewAt,
      offerAt: null,
      rejectedAt: null,
    });
  });

  test('OFFER retains an existing response', () => {
    // Arrange
    const existingResponse = new Date('2026-07-10T12:00:00.000Z');
    const existingInterview = new Date('2026-07-15T12:00:00.000Z');
    const existingOffer = new Date('2026-07-20T12:00:00.000Z');

    const application = {
      firstResponseAt: existingResponse,
      interviewAt: existingInterview,
      offerAt: existingOffer,
      rejectedAt: null,
    };

    // Act
    const result = synchronizeApplicationMilestones(application, 'OFFER');

    // Assert
    expect(result).toEqual({
      status: 'OFFER',
      firstResponseAt: existingResponse,
      interviewAt: existingInterview,
      offerAt: existingOffer,
      rejectedAt: null,
    });
  });

  test('REJECTED allows no response and preserves the rejection date', () => {
    // Arrange
    const existingRejected = new Date('2026-07-20T12:00:00.000Z');

    const application = {
      firstResponseAt: null,
      interviewAt: null,
      offerAt: null,
      rejectedAt: existingRejected,
    };

    // Act
    const result = synchronizeApplicationMilestones(application, 'REJECTED');

    // Assert
    expect(result).toEqual({
      status: 'REJECTED',
      firstResponseAt: null,
      interviewAt: null,
      offerAt: null,
      rejectedAt: existingRejected,
    });
  });

  test('REJECTED retains an existing response', () => {
    // Arrange
    const existingRejectedAt = new Date('2026-07-20T12:00:00.000Z');
    const existingFirstResponseAt = new Date('2026-07-10T12:00:00.000Z');
    const existingInterviewAt = new Date('2026-07-15T12:00:00.000Z');
    const existingOfferAt = new Date('2026-07-18T12:00:00.000Z');

    const application = {
      firstResponseAt: existingFirstResponseAt,
      interviewAt: existingInterviewAt,
      offerAt: existingOfferAt,
      rejectedAt: existingRejectedAt,
    };

    // Act
    const result = synchronizeApplicationMilestones(application, 'REJECTED');

    // Assert
    expect(result).toEqual({
      status: 'REJECTED',
      firstResponseAt: existingFirstResponseAt,
      interviewAt: existingInterviewAt,
      offerAt: existingOfferAt,
      rejectedAt: existingRejectedAt,
    });
  });

  test('REJECTED supplies now when no rejection date exists', () => {
    // Arrange
    const now = new Date('2026-07-20T12:00:00.000Z');

    const application = {
      firstResponseAt: null,
      interviewAt: null,
      offerAt: null,
      rejectedAt: null,
    };

    // Act
    const result = synchronizeApplicationMilestones(application, 'REJECTED', now);

    // Assert
    expect(result).toEqual({
      status: 'REJECTED',
      firstResponseAt: null,
      interviewAt: null,
      offerAt: null,
      rejectedAt: now,
    });
  });
});
