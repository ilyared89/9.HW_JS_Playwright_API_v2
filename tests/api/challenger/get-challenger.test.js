// tests/api/challenger/get-token.test.js
import { test, expect } from '../../../src/helpers/fixtures/fixture.js';

// 🔹 Теги
test('@tag("post") @tag("challenger") @tag("auth") @tag("smoke") Валидация токена авторизации', async ({ api }) => {
  
  // 🔹 Facade:)
  const token = await api.challenger.post();
  
  // 🔹 Бизнес-валидация: токен не пустой и нужной длины
  expect(token, 'Токен должен быть получен').toBeTruthy();
  expect(token.length, 'Длина токена должна быть 36 символов').toEqual(36);
  
  // 🔹 Дополнительно: проверяем формат (UUID v4)
  expect(token, 'Токен должен быть в формате UUID v4').toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
});