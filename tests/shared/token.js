// tests/shared/token.js

// 🔹 Инициализируем из process.env (воркеры унаследуют значение из globalSetup)
let _token = process.env.AUTH_TOKEN || null;

export const TokenStore = {
  get() {
    // 🔹 Двойная проверка: память → env (защита от гонок инициализации)
    if (!_token) {
      _token = process.env.AUTH_TOKEN || null;
    }

    if (!_token) {
      throw new Error('Токен не инициализирован. Убедитесь, что global.setup.js выполнился успешно.');
    }
    return _token;
  },

  set(token) {
    // 🔹 Синхронизируем память и env (для консистентности)
    _token = token;
    process.env.AUTH_TOKEN = token;
  },

  clear() {
    _token = null;
    delete process.env.AUTH_TOKEN;
  }
};