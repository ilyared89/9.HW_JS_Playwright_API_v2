// playwright.config.js
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  
  // 🔹 Глобальный таймаут (убираем явные timeout: из кода!)
  timeout: 15000,              // Общий таймаут теста
  expect: {
    timeout: 5000,             // Таймаут для expect-утверждений
  },
  
  // 🔹 Запуск тестов параллельно (для API — можно безопасно)
  fullyParallel: true,
  
  // 🔹 Fail on CI if test.only left in code
  forbidOnly: !!process.env.CI,
  
  // 🔹 Retry on CI only
  retries: process.env.CI ? 2 : 0,
  
  // 🔹 Workers: 1 для отладки, auto для прода
  workers: process.env.CI ? 1 : undefined,
  
  // 🔹 Репортеры
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['allure-playwright', { detail: true, suiteTitle: true }]
  ],
  
  // 🔹 Общие настройки для всех тестов
  use: {
    // 🔹 Базовый URL для API-запросов (убираем хардкод из тестов!)
   baseURL: 'https://apichallenges.eviltester.com',
    
    // 🔹 Сбор трейса при первом ретрае
    trace: 'on-first-retry',
    
    // 🔹 Скриншот только при падении (для UI-тестов)
    screenshot: 'only-on-failure',
    
    // 🔹 Игнорировать HTTPS-ошибки (если нужно для тестового стенда)
    ignoreHTTPSErrors: true,
  },
  
  // 🔹 Глобальная настройка перед всеми тестами
  globalSetup: './tests/setup/global.setup.js',
  
  // 🔹 Проекты
  projects: [
    // 🔹 Проект инициализации (например, получение токена)
    {
      name: 'setup',
      testMatch: /global\.setup\.js/,
    },
    
    // 🔹 API-тесты в Chromium 
    {
      name: 'api',
      use: { 
        ...devices['Desktop Chrome'],
        // 🔹 Переопределяем baseURL только для API-проекта (если нужно)
         baseURL: 'https://apichallenges.eviltester.com',
      },
      // 🔹 Зависимость от setup (если нужен токен)
      dependencies: ['setup'],
      // 🔹 Фильтрация по тегам (опционально)
      // grep: /@tag\("api"\)/,
    },

  ],
  
  // 🔹 Папка для результатов (для Allure)
  outputDir: 'allure-results',
});