// src/helpers/fixtures/fixture.js
import { test as base } from '@playwright/test';
import { Api } from '../../services/api.service.js';  
import { TokenStore } from '../../../tests/shared/token.js';  

export const test = base.extend({

  // Facade
  api: async ({ request }, use) => {
    const api = new Api(request);
    await use(api);
  },

  // 🔹 Токен из глобального хранилища (переиспользуется между тестами)
  token: [async ({}, use) => {
    const token = TokenStore.get();  
    await use(token);
  }, { scope: 'worker' }]  

});

// 🔹 Экспортируем expect для удобства в тестах
export { expect } from '@playwright/test';