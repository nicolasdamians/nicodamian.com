import { defineConfig } from 'vitest/config';

// Checks the files in dist/ as they will be published. Run `npm run build` first.
export default defineConfig({
  test: { include: ['tests/build/**/*.test.ts'] },
});
