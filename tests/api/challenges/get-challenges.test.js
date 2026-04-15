// tests/api/challenges/get-challenges.test.js
import { test, expect } from '../../../src/helpers/fixtures/fixture.js';

// 🔹 Теги
test('@tag("get") @tag("challenges") @tag("happy-path") Получить список челленджей', async ({ api, token }) => {
  
  // 🔹 Facade: получаем список челленджей
  const response = await api.challenges.get(token);
  
  // 🔹 Валидация
  const challenges = Array.isArray(response) ? response : response.challenges;
  
  expect(Array.isArray(challenges), 'Ответ должен содержать массив челленджей').toBeTruthy();
  expect(challenges.length, 'Должно быть ровно 59 челленджей').toEqual(59);
  
  // 🔹 Валидация структуры первого элемента (по реальной схеме API)
  if (challenges.length > 0) {
    const first = challenges[0];
    
    // ✅ Реальные поля из ответа: id, name, description, status
    expect(first).toHaveProperty('id');
    expect(first).toHaveProperty('name');        
    expect(first).toHaveProperty('description');
    expect(first).toHaveProperty('status');      
    
    // 🔹 Дополнительные проверки типов (опционально)
    expect(typeof first.id, 'ID должен быть числом').toBe('number');
    expect(typeof first.name, 'Имя должно быть строкой').toBe('string');
    expect(typeof first.status, 'Статус должен быть булевым').toBe('boolean');
  }
});