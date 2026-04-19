//src/helpers/fixtures/fixture.js
import { test as baseTest, expect } from '@playwright/test';
import { TodoServices } from '../../services/TodoServices.js';
import { ApiFacade } from '../../facades/ApiFacade.js';
import fs from 'fs';
import path from 'path';

function getToken() {
  const tokenPath = path.join(process.cwd(), '.auth', 'token.json');
  
  if (!fs.existsSync(tokenPath)) {
    throw new Error('Token file not found. Run global setup first.');
  }
  
  const tokenData = JSON.parse(fs.readFileSync(tokenPath, 'utf-8'));
  return tokenData.token;
}

export const test = baseTest.extend({
  token: async ({}, use) => {
    const token = getToken();
    await use(token);
  },

  todoServices: async ({ request }, use) => {
    const token = getToken();
    const services = new TodoServices(request, token);
    await use(services);
  },

  apiFacade: async ({ request }, use) => {
    const token = getToken();
    const facade = new ApiFacade(request, token);
    await use(facade);
  },

  // ✅ Расширяем apiRequest методами для Challenger API
  challengerApi: async ({ request, token }, use) => {
    const api = {
      // Получить данные сессии
      async getChallengerData(token) {
        const response = await apiRequest('GET', `/challenger/${token}`);
        return response.json();
      },
      
      // Восстановить сессию
      async restoreSession(token, data) {
        const response = await apiRequest('PUT', `/challenger/${token}`, {
          data: JSON.stringify(data)
        });
        return response.json();
      },
      
      // Создать новую сессию (если нужно)
      async createSession() {
        const response = await apiRequest('POST', '/challenger');
        return {
          token: response.headers()['x-challenger'],
          raw: response
        };
      }
    };
    
    await use(api);
  }
});

export { expect };