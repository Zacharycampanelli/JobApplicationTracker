import { describe, expect, test } from 'vitest';
import { synchronizeApplicationMilestones } from './synchronizeApplicationMilestones';

describe('synchronizeApplicationMilestones', () => {
  test('APPLIED clears every milestone date', () => {

    // Arrange
     const application = {
    firstResponseAt: new Date("2026-07-05"),
    interviewAt: new Date("2026-07-10"),
    offerAt: new Date("2026-07-15"),
    rejectedAt: new Date("2026-07-20")
  };
})

  test('clears first response when status is set to APPLIED', () => {
    // Arrange
    const existingResponse = new Date('2026-07-10T12:00:00.000Z');

    const application = {
      firstResponseAt: existingResponse,
    };

    // Act
    const result = synchronizeApplicationMilestones(application, 'APPLIED');

    // Assert
    expect(result).toEqual({ status: 'APPLIED', firstResponseAt: null });
  });

  test('INTERVIEW supplies now when no response exists', () => {
    // Arrange
    const application = { firstResponseAt: null };

    const now = new Date('2026-07-20T12:00:00.000Z');
    // Act
    const result = synchronizeApplicationMilestones(application, 'INTERVIEW', now);

    // Assert
    expect(result).toEqual({ status: 'INTERVIEW', firstResponseAt: now });
  });

  test('INTERVIEW retains an existing response', () => {
    // Arrange
    const existingResponse = new Date('2026-07-10T12:00:00.000Z');

    const application = {
      firstResponseAt: existingResponse,
    };

    // Act
    const result = synchronizeApplicationMilestones(application, 'INTERVIEW');

    // Assert
    expect(result).toEqual({ status: 'INTERVIEW', firstResponseAt: existingResponse });
  });

  test('OFFER supplies now when no response exists', () => {
    // Arrange
    const application = { firstResponseAt: null };
    
    const now = new Date('2026-07-20T12:00:00.000Z');
    // Act
    const result = synchronizeApplicationMilestones(application, 'OFFER', now);

    // Assert
    expect(result).toEqual({ status: 'OFFER', firstResponseAt: now });
  });

  test('OFFER retains an existing response', () => {
    // Arrange
    const existingResponse = new Date('2026-07-10T12:00:00.000Z');

    const application = {
      firstResponseAt: existingResponse,
    };

    // Act
    const result = synchronizeApplicationMilestones(application, 'OFFER');

    // Assert
    expect(result).toEqual({ status: 'OFFER', firstResponseAt: existingResponse });
  });

  test('REJECTED retains null', () => {
    // Arrange
    const application = { firstResponseAt: null };

    // Act
    const result = synchronizeApplicationMilestones(application, 'REJECTED');

    // Assert
    expect(result).toEqual({ status: 'REJECTED', firstResponseAt: null });
  });

  test('REJECTED retains an existing response', () => {
    // Arrange
    const existingResponse = new Date('2026-07-10T12:00:00.000Z');

    const application = {
      firstResponseAt: existingResponse,
    };

    // Act
    const result = synchronizeApplicationMilestones(application, 'REJECTED');

    // Assert
    expect(result).toEqual({ status: 'REJECTED', firstResponseAt: existingResponse });
  });
});
