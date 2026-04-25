/**
 * @typedef {Object} AuthResult
 * @property {number} status - HTTP статус код
 * @property {string} token - X-Auth-Token из заголовка
 * @property {string} body - Сырое тело ответа
 */

/**
 * Получает токен аутентификации
 * @param {string} username
 * @param {string} password
 * @returns {Promise<AuthResult>}
 */

export class SecretService {
  constructor(request, token) {  // ✅ token вторым параметром
    this.request = request;
    this.token = token;  // ✅ сохраняем для использования
  }

  async getToken(username, password) {
    const auth = Buffer.from(`${username}:${password}`).toString('base64');
    
    // 🔹 Логирование ВСЕХ заголовков для отладки
    const headers = { 
      'Authorization': `Basic ${auth}`,
      'X-CHALLENGER': this.token,  // ✅ Используем сохранённый токен
      'Accept': 'application/json'
    };
    
    console.log('🔍 SecretService.getToken headers:', JSON.stringify(headers, null, 2));
    
    const response = await this.request.post('/secret/token', { headers });
    
    return {
      status: response.status(),
      token: response.headers()['x-auth-token'],
      body: await response.text().catch(() => '')
    };
  }
  
  // 🔹 Остальные методы тоже используют this.token:
  async getNote(authToken) {
    const response = await this.request.get('/secret/note', {
      headers: { 
        'X-CHALLENGER': this.token,  // ✅ Обязательно!
        'X-AUTH-TOKEN': authToken 
      }
    });
    return {
      status: response.status(),
      body: await response.json().catch(() => ({}))
    };
  }
  
  async postNote(authToken, note) {
    const response = await this.request.post('/secret/note', {
      headers: { 
        'X-CHALLENGER': this.token,  // ✅ Обязательно!
        'X-AUTH-TOKEN': authToken 
      },
       data: { note }  // ✅ КЛЮЧ "" ОБЯЗАТЕЛЕН
    });
    return await response.json();
  }
}