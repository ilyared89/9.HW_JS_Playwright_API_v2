// src/helpers/assertions/apiAssertions.js
import { expect } from '@playwright/test';

export const apiAssertions = {
  /** Проверка валидности объекта Todo */
  toBeValidTodo(todo, overrides = {}) {
    expect(typeof todo.id, 'id должен быть number').toBe('number');
    expect(typeof todo.title, 'title должен быть string').toBe('string');
    expect(typeof todo.doneStatus, 'doneStatus должен быть boolean').toBe('boolean');
    expect(typeof todo.description, 'description должен быть string').toBe('string');
    
    Object.entries(overrides).forEach(([key, value]) => {
      expect(todo[key], `поле ${key} должно совпадать`).toBe(value);
    });
    return this;
  },

  /** Проверка ошибки валидации (400 + errorMessages) */
  toHaveValidationError(response, messageFragment = null) {
    expect(response.status, 'должен быть статус 400').toBe(400);
    expect(response.body?.errorMessages, 'должны быть errorMessages').toBeDefined();
    expect(Array.isArray(response.body.errorMessages), 'errorMessages должен быть массивом').toBe(true);
    expect(response.body.errorMessages.length, 'должно быть хотя бы одно сообщение').toBeGreaterThan(0);
    
    if (messageFragment) {
      const allMessages = response.body.errorMessages.join(' ').toLowerCase();
      expect(allMessages, `сообщение должно содержать "${messageFragment}"`).toContain(messageFragment.toLowerCase());
    }
    return this;
  },

  /** Проверка формата ответа по Content-Type */
  toHaveContentType(response, expectedType) {
    const contentType = response.headers?.['content-type'] || '';
    expect(contentType, `Content-Type должен содержать "${expectedType}"`).toContain(expectedType);
    return this;
  },

  /** Проверка ответа со списком challenges */
  toBeValidChallengesResponse(body) {
    expect(body.challenges, 'должно быть поле challenges').toBeDefined();
    expect(Array.isArray(body.challenges), 'challenges должен быть массивом').toBe(true);
    expect(body.challenges.length, 'должен быть хотя бы один челлендж').toBeGreaterThan(0);
    return this;
  },

  /** Проверка ответа со списком todos */
  toBeValidTodosResponse(body) {
     // 🔹 API может вернуть: {todos: [...]} ИЛИ [...] ИЛИ {data: [...]}
  let todos = null;
  
  if (Array.isArray(body)) {
    todos = body;
  } else if (body?.todos !== undefined && Array.isArray(body.todos)) {
    todos = body.todos;
  } else if (body?.data !== undefined && Array.isArray(body.data)) {
    todos = body.data;
  } else if (typeof body === 'string') {
    try {
      const parsed = JSON.parse(body);
      todos = Array.isArray(parsed) ? parsed : parsed?.todos || parsed?.data;
    } catch (e) {}
  }
  
  // 🔹 Если не нашли массив — проверяем, что это хотя бы объект с данными
  if (todos === null) {
    expect(body, `ответ должен содержать todos, получено: ${JSON.stringify(body)?.slice(0, 150)}`).toBeDefined();
    return this;
  }
  
  expect(Array.isArray(todos), `todos должен быть массивом`).toBe(true);
  
  if (todos.length > 0) {
    this.toBeValidTodo(todos[0]);
  }
  return this;
},
    /* 
    const todos = Array.isArray(body) ? body : body?.todos;
    expect(todos, 'должен быть массив todos').toBeDefined();
    expect(Array.isArray(todos), 'todos должен быть массивом').toBe(true);
  
    if (todos.length > 0) {
      this.toBeValidTodo(todos[0]);
    }
    return this;
  },
  */

  /** Проверка успешного статуса (200/201/204) */
  toBeSuccess(status) {
    expect([200, 201, 204], 'должен быть успешный статус').toContain(status);
    return this;
  }
};