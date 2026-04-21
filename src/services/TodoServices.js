// src/services/TodoServices.js
import { test } from "@playwright/test";
import { TodoBuilder } from "../builders/TodoBuilder.js";

export class TodoServices {
  // 🔹 ОБЯЗАТЕЛЬНО: объявление приватных полей
  #apiRequest;
  #token;
  #baseURL;

  constructor(request, token, baseURL) {
    // 🔹 Присваиваем в приватные поля
    this.#apiRequest = request;
    this.#token = token;
    this.#baseURL = baseURL || process.env.BASE_URL || "https://apichallenges.eviltester.com";
    
    this.baseHeaders = {
      "X-CHALLENGER": this.#token,
      Accept: "application/json",
      "Content-Type": "application/json",
    };
  }

  // 🔹 Приватный хелпер для всех запросов
  async #doRequest(method, endpoint, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${this.#baseURL}${endpoint}`;
    const headers = { ...this.baseHeaders, ...options.headers };
    
    const config = { method, headers, ...options };
    
    // Обработка data: объект → JSON, иначе как есть
    if (options.data !== undefined) {
      config.data = (typeof options.data === 'object' && !options.isXml) 
        ? JSON.stringify(options.data) 
        : options.data;
    }
    
    return await this.#apiRequest.fetch(url, config);
  }

  // 🔹 ПУБЛИЧНЫЕ ГЕТТЕРЫ (возвращают приватные поля)
  get request() { return this.#apiRequest; }
  get token() { return this.#token; }
  get baseURL() { return this.#baseURL; }

  // ==========================================
  // 🔹 ЧАЛЛЕНДЖЕРЫ
  // ==========================================
  async getChallenges() {
    return test.step("GET /challenges", async () => {
      const response = await this.#doRequest('GET', '/challenges');
      return await response.json();
    });
  }

  async getChallengerData(challengerToken) {
    return test.step(`GET /challenger/${challengerToken}`, async () => {
      const response = await this.#apiRequest.fetch(`${this.#baseURL}/challenger/${challengerToken}`, {
        method: 'GET',
        headers: { 'X-CHALLENGER': this.#token }
      });
      return await response.json();
    });
  }

  // ==========================================
  // 🔹 TODOS - READ
  // ==========================================
  async getAllTodos(params = {}) {
    return test.step("GET /todos", async () => {
      const query = new URLSearchParams(params).toString();
      const endpoint = `/todos${query ? '?' + query : ''}`;
      const response = await this.#doRequest('GET', endpoint);
      return await response.json();
    });
  }

  async getTodoById(id) {
    return test.step(`GET /todos/${id}`, async () => {
      const response = await this.#doRequest('GET', `/todos/${id}`);
      return await response.json();
    });
  }

  async getTodoByIdStatus(id) {
    return test.step(`GET /todos/${id} (status)`, async () => {
      const response = await this.#doRequest('GET', `/todos/${id}`);
      return response.status();
    });
  }

  async getTodosWithDoneStatusTrue() {
    return this.getAllTodos({ doneStatus: true });
  }

  async headTodos() {
    return test.step("HEAD /todos", async () => {
      const response = await this.#doRequest('HEAD', '/todos');
      return {
        status: response.status(),
        headers: response.headers(),
      };
    });
  }

  async optionsTodos() {
    return test.step("OPTIONS /todos", async () => {
      const response = await this.#doRequest('OPTIONS', '/todos');
      return {
        status: response.status(),
        headers: response.headers(),
      };
    });
  }

  // ==========================================
  // 🔹 TODOS - CREATE
  // ==========================================
  async createTodo(data) {
    return test.step("POST /todos (create)", async () => {
      const response = await this.#doRequest('POST', '/todos', {  data });
      return await response.json();
    });
  }

  async createTodoWithStatus(data) {
    return test.step("POST /todos (create with status)", async () => {
      const response = await this.#doRequest('POST', '/todos', {  data });
      return {
        status: response.status(),
        body: await response.json(),
      };
    });
  }

  async createTodoWithContentType(data, contentType, accept) {
    return test.step(`POST /todos (${contentType} -> ${accept})`, async () => {
      const response = await this.#doRequest('POST', '/todos', {
        data,
        headers: {
          ...this.baseHeaders,
          'Content-Type': contentType,
          Accept: accept,
        },
        isXml: contentType === 'application/xml'
      });
      
      const ct = response.headers()['content-type'] || '';
      return ct.includes('xml') ? await response.text() : await response.json();
    });
  }

  // ==========================================
  // 🔹 TODOS - UPDATE
  // ==========================================
  async updateTodoPartial(id, data) {
    return test.step(`POST /todos/${id} (amend)`, async () => {
      const response = await this.#doRequest('POST', `/todos/${id}`, {  data });
      return await response.json();
    });
  }

  async fullUpdateTodo(id, data) {
    return test.step(`PUT /todos/${id}`, async () => {
      const response = await this.#doRequest('PUT', `/todos/${id}`, {  data });
      return await response.json();
    });
  }

  async fullUpdateTodoWithStatus(id, data) {
    return test.step(`PUT /todos/${id} (with status)`, async () => {
      const response = await this.#doRequest('PUT', `/todos/${id}`, {  data });
      return {
        status: response.status(),
        body: await response.json(),
      };
    });
  }

  // ==========================================
  // 🔹 TODOS - DELETE
  // ==========================================
  async deleteTodo(id) {
    return test.step(`DELETE /todos/${id}`, async () => {
      const response = await this.#doRequest('DELETE', `/todos/${id}`);
      return response.status();
    });
  }

  // ==========================================
  // 🔹 HEARTBEAT & STATUS
  // ==========================================
  async getHeartbeat() {
    return test.step("GET /heartbeat", async () => {
      const response = await this.#doRequest('GET', '/heartbeat');
      return response.status();
    });
  }

  async patchHeartbeat() {
    return test.step("PATCH /heartbeat", async () => {
      const response = await this.#doRequest('PATCH', '/heartbeat');
      return response.status();
    });
  }

  async deleteHeartbeat() {
    return test.step("DELETE /heartbeat", async () => {
      const response = await this.#doRequest('DELETE', '/heartbeat');
      return response.status();
    });
  }

  async getInvalidEndpoint() {
    return test.step("GET /todo (invalid)", async () => {
      const response = await this.#doRequest('GET', '/todo');
      return response.status();
    });
  }

  // ==========================================
  // 🔹 AUTH
  // ==========================================
  async getSecretToken(username, password) {
    return test.step("POST /secret/token", async () => {
    const auth = Buffer.from(`${username}:${password}`).toString("base64");
    
    const response = await this.#apiRequest.fetch(`${this.#baseURL}/secret/token`, {
      method: 'POST',
      headers: {
        // 🔹 Добавляем X-CHALLENGER — это ключевое!
        'X-CHALLENGER': this.#token,
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json'
      }
    });
    
    const text = await response.text();
    let token = response.headers()["x-auth-token"];
    
    // 🔹 Токен может быть и в теле ответа
    if (!token && text) {
      try {
        const parsed = JSON.parse(text);
        token = parsed.token || parsed.authToken;
      } catch (e) {}
    }
    
    return {
      status: response.status(),
      token,
      body: text
    };
  });
  }

  async getSecretNote(authToken) {
  return test.step('GET /secret/note', async () => {
    const response = await this.request.get(`${this.baseURL}/secret/note`, {
      headers: {
        'X-CHALLENGER': this.token,
        'X-AUTH-TOKEN': authToken,
        'Accept': 'application/json'
      }
    });
    
    // Возвращаем статус и тело для проверки
    return {
      status: response.status(),
      body: response.status() === 200 ? await response.json() : null
    };
  });
}

  /*async getSecretNote(authToken) {
  return test.step("GET /secret/note", async () => {
    const response = await this.#doRequest('GET', '/secret/note', {
      headers: { 'X-AUTH-TOKEN': authToken }
    });
    
    const text = await response.text();
    console.log(`🔍 Secret note response: status=${response.status()}, body="${text?.slice(0, 200)}"`);
    
    // 🔹 Пробуем распарсить как JSON, иначе возвращаем как есть
    try {
      if (!text) return {};
      const parsed = JSON.parse(text);
      return parsed;
    } catch (e) {
      // Если не JSON — возвращаем как строку в поле note
      return { note: text, raw: text };
    }
  });
  }
*/
  async getSecretNoteWithStatus(authToken) {
    return test.step("GET /secret/note (status)", async () => {
      const response = await this.#doRequest('GET', '/secret/note', {
        headers: { 'X-AUTH-TOKEN': authToken }
      });
      return response.status();
    });
  }

  async postSecretNote(authToken, note) {
    return test.step("POST /secret/note", async () => {
      const response = await this.#doRequest('POST', '/secret/note', {
        data: { note },  // ✅ КЛЮЧ data: НА МЕСТЕ
        headers: { 'X-AUTH-TOKEN': authToken }
      });
      const text = await response.text();
      return text ? JSON.parse(text) : { note };
      //return await response.json();
    });
  }

  // ==========================================
  // 🔹 УТИЛИТЫ
  // ==========================================
  async createAndReturnTodo(overrides = {}) {
    const defaultTodo = {
      title: TodoBuilder.unique(),
      doneStatus: false,
      description: ''
    };
    return await this.createTodo({ ...defaultTodo, ...overrides });
  }

  async cleanupTodosByPrefix(prefix = 'Test-') {
    try {
    const { todos } = await this.getAllTodos();
    const testTodos = (todos || [])
      .filter(t => t.title?.startsWith(prefix) && t.id)
      .map(t => t.id);
    
    // Удаляем параллельно для скорости
    await Promise.all(
      testTodos.map(id => this.#apiRequest.fetch(`${this.#baseURL}/todos/${id}`, {
        method: 'DELETE',
        headers: { 'X-CHALLENGER': this.#token }
      }).catch(() => {}))
    );
    
    return { deleted: testTodos.length };
  } catch (e) {
    console.warn('Cleanup error:', e.message);
    return { deleted: 0 };
  }
}
};
