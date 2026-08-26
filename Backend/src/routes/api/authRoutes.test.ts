import request from 'supertest';
import { afterEach, describe, expect, it, vi } from 'vitest';

import app from '../../app';
import { prisma } from '../../lib/prisma';
import { comparePassword } from '../../utils/hash';
import { generateToken } from '../../utils/generateToken';

afterEach(() => {
  vi.clearAllMocks();
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

vi.mock('../../utils/hash', () => ({
  comparePassword: vi.fn(),
  hashPassword: vi.fn(),
}));

vi.mock('../../utils/generateToken', () => ({
  generateToken: vi.fn(),
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

  it('returns 401 when the password is incorrect', async () => {
    const body = { email: 'user1@example.com', password: 'wrong-password' };

    const user = {
      id: 1,
      email: 'user1@example.com',
      password: 'stored-password-hash',
      name: 'User 1',
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
    };

    vi.mocked(prisma.user.findUnique).mockResolvedValue(user);
    vi.mocked(comparePassword).mockResolvedValue(false);

    const response = await request(app).post('/api/auth/login').send(body);

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'Invalid credentials' });
    expect(comparePassword).toHaveBeenCalledWith(body.password, user.password);
  });

  it('returns the authenticated user and token for valid credentials', async () => {
    const body = { email: 'user1@example.com', password: 'password1!' };

    const user = {
      id: 1,
      email: 'user1@example.com',
      password: 'password1!',
      name: 'User 1',
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
    };

    const token = 'abc123';

    vi.mocked(prisma.user.findUnique).mockResolvedValue(user);
    vi.mocked(comparePassword).mockResolvedValue(true);
    vi.mocked(generateToken).mockReturnValue(token);

    const response = await request(app).post('/api/auth/login').send(body);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt.toISOString(),
      },
    });
    expect(generateToken).toHaveBeenCalledWith(user.id);
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
