import { faker } from "@faker-js/faker";

export const createFakeResume = () => {
  return {
    name: faker.lorem.word(),
    fileUrl: faker.internet.url(),
    mimeType: faker.helpers.arrayElement(['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
  };
};