import { faker } from '@faker-js/faker';

const statuses = ['APPLIED', 'INTERVIEW', 'OFFER', 'REJECTED'] as const;

export const createFakeApplication = () => {
  return {
    title: faker.person.jobTitle(),
    company: faker.company.name(),
    status: faker.helpers.arrayElement(statuses),
    appliedAt: faker.date.recent(),
    notes: faker.lorem.paragraph(),
    link: faker.internet.url(),
  };
};
