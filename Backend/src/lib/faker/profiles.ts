import { faker } from "@faker-js/faker";

export const createFakeProfile = () => {
  return {
    summary: faker.lorem.paragraph(),
    title: faker.person.jobTitle(),
    location: `${faker.location.city()}, ${faker.location.state({ abbreviated: true })}`,
    website: faker.internet.url(),
    linkedin: `https://www.linkedin.com/in/${faker.internet.username()}`,
    avatarUrl: null
  };
};