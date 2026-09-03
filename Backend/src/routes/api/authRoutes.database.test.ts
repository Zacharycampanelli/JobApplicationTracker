import request from "supertest";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import app from "../../app";
import { prisma } from "../../lib/prisma";
import { hashPassword } from "../../utils/hash";

vi.mock('../../services/emailService', () => ({
  sendPasswordResetEmail: vi.fn(),
}));

const testEmail = 'database-user@example.test';

beforeAll(async () => {
  const [result] = await prisma.$queryRaw<Array<{ database: string }>>`
    SELECT current_database() AS database
  `;

  if (result?.database !== 'job_tracker_test') {
    throw new Error(`Refusing to run database tests against ${result?.database ?? 'an unknown database'}`);
  }
});

beforeEach(async () => {
  await prisma.user.deleteMany({
    where: {
      email: testEmail,
    },
  });
});

afterEach(async () => {
  await prisma.user.deleteMany({
    where: {
      email: testEmail,
    },
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('POST /api/auth/login with PostgreSQL', () => {
  it('returns 401 when the user does not exist', async () => {
    const body = {
      email: testEmail,
      password: 'any-password',
    };

    const response = await request(app).post('/api/auth/login').send(body);

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      error: 'Invalid credentials',
    });
  });

  it('returns 200 for valid stored credentials', async () => {
    const password = 'password1!';
    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email: testEmail,
        password: hashedPassword,
        name: 'Database Test User',
      },
    });

    const response = await request(app).post('/api/auth/login').send({
      email: testEmail,
      password,
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'Login successful',
      token: expect.any(String),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt.toISOString(),
      },
    });
  });
});
