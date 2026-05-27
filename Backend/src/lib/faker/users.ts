import { faker } from '@faker-js/faker';
import { hashPassword } from '../../utils/hash';

const DEV_PASSWORD = 'password1!';
let i = 0;
export const createFakeUser = async () => {
  return {
    email: `user${++i}@example.com`,
    password: await hashPassword(DEV_PASSWORD),
    name: faker.person.fullName(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  };
};
