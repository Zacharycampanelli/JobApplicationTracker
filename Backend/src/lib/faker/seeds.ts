import "dotenv/config"
import { prisma } from '../prisma';
import { createFakeUser } from './users';
async function seed() {
  for (let i = 0; i < 10; i++) {
    await prisma.user.create({
        data: await createFakeUser(),
    })
  }
}

seed();