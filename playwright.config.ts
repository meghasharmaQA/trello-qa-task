import { defineConfig } from '@playwright/test';

export default defineConfig({
   retries: 0,
  timeout: 60000, // 60 sec per test

  use: {
    headless: false,
    actionTimeout: 30000,   // each click/fill action
    navigationTimeout: 60000 // page loads
  },

  reporter: [['html', { open: 'always' }]]
});