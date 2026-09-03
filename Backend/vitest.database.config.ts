import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['**/*.database.test.{ts,js}'],
  },
});