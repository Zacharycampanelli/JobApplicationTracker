import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import app from './app';

const avatarDirectory = path.join(process.cwd(), 'uploads', 'avatars');
const resumeDirectory = path.join(process.cwd(), 'uploads', 'resumes');

const avatarFilename = 'public-avatar-test.txt';
const resumeFilename = 'private-resume-test.txt';

const avatarPath = path.join(avatarDirectory, avatarFilename);
const resumePath = path.join(resumeDirectory, resumeFilename);

beforeAll(async () => {
  await Promise.all([mkdir(avatarDirectory, { recursive: true }), mkdir(resumeDirectory, { recursive: true })]);
  await Promise.all([writeFile(avatarPath, 'avatar fixture'), writeFile(resumePath, 'resume fixture')]);
});

afterAll(async () => {
  await Promise.all([rm(avatarPath, { force: true }), rm(resumePath, { force: true })]);
});

describe('static upload access', () => {
  it('serves avatar files publicly', async () => {
    const response = await request(app).get(`/uploads/avatars/${avatarFilename}`);

    expect(response.status).toBe(200);
    expect(response.text).toBe('avatar fixture');
  });

  it('does not serve resume files publicly', async () => {
    const response = await request(app).get(`/uploads/resumes/${resumeFilename}`);

    expect(response.status).toBe(404);
  });
});
