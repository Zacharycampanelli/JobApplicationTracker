import "dotenv/config";
import { faker } from "@faker-js/faker";

import { prisma } from "../prisma";
import { createFakeApplication } from "./applications";
import { createFakePreferences } from "./preferences";
import { createFakeProfile } from "./profiles";
import { createFakeResume } from "./resumes";
import { createFakeUser } from "./users";

async function seed() {
  await prisma.jobApplication.deleteMany();
  await prisma.resume.deleteMany();
  await prisma.user.deleteMany();

  for (let i = 0; i < 10; i++) {
    const user = await prisma.user.create({
      data: {
        ...(await createFakeUser()),
        profile: {
          create: createFakeProfile()
        },
        preferences: {
          create: createFakePreferences()
        }
      }
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
    const applicationCount = faker.number.int({ min: 1, max: 10 });

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
