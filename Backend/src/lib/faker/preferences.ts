import { faker } from '@faker-js/faker';

export const createFakePreferences = () => {
  return {
    publicProfileEnabled: true,
    autoStatusUpdatesEnabled: faker.datatype.boolean(),
    themePreference: faker.helpers.arrayElement(['light', 'dark', 'system'])
  };
};
