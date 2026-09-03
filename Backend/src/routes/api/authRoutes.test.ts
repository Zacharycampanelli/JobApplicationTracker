import jwt from "jsonwebtoken";
import request from "supertest";
import { afterEach, describe, expect, it, vi } from "vitest";

import app from "../../app";
import { prisma } from "../../lib/prisma";
import { generateToken } from "../../utils/generateToken";
import { comparePassword } from "../../utils/hash";

afterEach(() => {
  vi.resetAllMocks();
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

vi.mock('jsonwebtoken', () => ({
  default: {
    verify: vi.fn(),
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

  it('returns 500 when the user lookup fails', async () => {
    const body = {
      email: 'user1@example.com',
      password: 'password1!',
    };

    const databaseError = new Error('Database unavailable');

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    vi.mocked(prisma.user.findUnique).mockRejectedValue(databaseError);

    const response = await request(app).post('/api/auth/login').send(body);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Failed to login' });
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error logging in:', databaseError);
  });
});

describe('GET /api/auth/me', () => {
  it('returns 401 when no authorization token is provided', async () => {
    const response = await request(app).get('/api/auth/me');

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'Not authorized, no token provided' });
  });

  it('returns 401 when an invalid authorization token is provided', async () => {
    vi.mocked(jwt.verify).mockImplementation(() => {
      throw new Error('jwt malformed');
    });
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const response = await request(app).get('/api/auth/me').set('Authorization', 'Bearer invalid-token');

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'Not authorized, token failed' });
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  it('returns 404 when the authenticated user no longer exists', async () => {
    vi.mocked(jwt.verify).mockImplementation(() => ({ userId: 1 }));
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    const response = await request(app).get('/api/auth/me').set('Authorization', 'Bearer valid-token');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'User not found' });
    expect(prisma.user.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 1 },
      }),
    );
  });

  it('returns the authenticated user', async () => {
    vi.mocked(jwt.verify).mockImplementation(() => ({ userId: 1 }));
    const user = {
      id: 1,
      name: 'User 1',
      email: 'user1@example.com',
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-02'),
      profile: null,
      preferences: null,
    };
    vi.mocked(prisma.user.findUnique).mockResolvedValue(user as never);

    const response = await request(app).get('/api/auth/me').set('Authorization', 'Bearer valid-token');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      profile: user.profile,
      preferences: user.preferences,
    });
    expect(prisma.user.findUnique).toHaveBeenCalledWith(expect.objectContaining({ where: { id: 1 } }));
  });

  it('returns 500 when user lookup fails', async () => {
    vi.mocked(jwt.verify).mockImplementation(() => ({ userId: 1 }));
    const databaseError = new Error('Error fetching current user');
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    vi.mocked(prisma.user.findUnique).mockRejectedValue(databaseError);

    const response = await request(app).get('/api/auth/me').set('Authorization', 'Bearer valid-token');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Failed to fetch user' });
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching current user:', databaseError);
  });
});
