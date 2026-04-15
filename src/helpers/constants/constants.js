// src/helpers/constants.js
export const API = {
  // 🔹 Базовый URL берётся из playwright.config.js (baseURL)
  // Здесь только относительные пути эндпоинтов
  ENDPOINTS: {
    CHALLENGER: '/challenger',
    CHALLENGES: '/challenges',
    TODOS: '/todos',
  },
  HEADERS: {
    CHALLENGER: 'X-CHALLENGER',
  },
};