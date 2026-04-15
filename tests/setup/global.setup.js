// tests/setup/global.setup.js — с отладочным логом
import { request } from '@playwright/test';
import { TokenStore } from '../shared/token.js';  // ← Для отладки

export default async function globalSetup() {
  const apiContext = await request.newContext({
    baseURL: 'https://apichallenges.eviltester.com'
  });

  const response = await apiContext.post('/challenger');
  const headers = response.headers();
  const token = headers['x-challenger'];

  // 🔹 Основной механизм: передача через env
  process.env.AUTH_TOKEN = token;
  
  // 🔹 Отладка: сохраняем в память главного процесса (не влияет на воркеры)
  TokenStore.set(token);
  console.log('🔹 DEBUG: Token in main process:', token.substring(0, 10) + '...');

  await apiContext.dispose();
  console.log('✅ Токен передан в process.env.AUTH_TOKEN');
}