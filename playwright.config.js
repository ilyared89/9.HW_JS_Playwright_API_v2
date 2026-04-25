// playwright.config.js
import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  
  globalSetup: './tests/setup/global.setup.js',
  globalTeardown: './tests/setup/global.teardown.js',
  
   reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report' }]
  ],
  
  use: {
    baseURL: 'https://apichallenges.eviltester.com',
    trace: 'on-first-retry',
    storageState: path.join(process.cwd(), '.auth', 'token.json'),
    extraHTTPHeaders: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  },
  
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});