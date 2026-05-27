import 'dotenv/config';
import { prisma } from '../prisma';
import { createFakeUser } from './users';
import { createFakeResume } from './resumes';
import { faker } from '@faker-js/faker';
import { createFakeApplication } from './applications';

async function seed() {
  await prisma.jobApplication.deleteMany();
  await prisma.resume.deleteMany();
  await prisma.user.deleteMany();

  for (let i = 0; i < 10; i++) {
    const user = await prisma.user.create({
      data: await createFakeUser(),
    });

    const resumes = await Promise.all(
      Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () =>
        prisma.resume.create({
          data: {
            ...createFakeResume(),
            userId: user.id,
          },
        }),
      ),
    );
    const applicationCount = faker.number.int({ min: 0, max: 10 });

    await Promise.all(
      Array.from({ length: applicationCount }, () => {
        const shouldAttachResume = faker.datatype.boolean();
        const selectedResume = shouldAttachResume ? faker.helpers.arrayElement(resumes) : null;

        return prisma.jobApplication.create({
          data: {
            ...createFakeApplication(),
            userId: user.id,
            resumeId: selectedResume?.id ?? null,
          },
        });
      }),
    );
  }
}

seed();
