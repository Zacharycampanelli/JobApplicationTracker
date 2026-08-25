import request from 'supertest';
import { afterEach, describe, expect, it, vi } from 'vitest';

import app from '../../app';
import { prisma } from '../../lib/prisma';

afterEach(() => {
  vi.restoreAllMocks();
});

vi.mock('../../services/emailService', () => ({
  sendPasswordResetEmail: vi.fn(),
}));

vi.mock('../../lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

describe('POST /api/auth/login', () => {
  it.each([
    {
      description: 'an empty body',
      body: {},
    },
    {
      description: 'missing password',
      body: { email: 'user1@example.com' },
    },
    {
      description: 'missing email',
      body: { password: 'password1!' },
    },
  ])('returns 400 for $description', async ({ body }) => {
    const response = await request(app).post('/api/auth/login').send(body);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Email and password are required' });
  });

  it('returns 401 for invalid credentials', async () => {
    const body = {
      email: 'user1@example.com',
      password: 'password1!',
    };

    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    const response = await request(app).post('/api/auth/login').send(body);

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'Invalid credentials' });
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: {
        email: body.email,
      },
    });
  });
});

describe('GET /api/auth/me', () => {
  it('returns 401 when no authorization token is provided', async () => {
    const response = await request(app).get('/api/auth/me');

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'Not authorized, no token provided' });
  });

  it('returns 401 when an invalid authorization token is provided', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const response = await request(app).get('/api/auth/me').set('Authorization', 'Bearer invalid-token');

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'Not authorized, token failed' });
    expect(consoleErrorSpy).toHaveBeenCalled();
  });
});
