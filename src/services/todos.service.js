// src/services/todos.service.js

export class TodosService {
  constructor(request) {
    this.request = request;
  }

  // 🔹 CREATE
  async create(token, data) {
    const response = await this.request.post('/todos', {
      headers: { 'X-CHALLENGER': token },
       data
    });
    return await response.json();
  }

  // 🔹 READ ALL
  async getAll(token) {
    const response = await this.request.get('/todos', {
      headers: { 'X-CHALLENGER': token }
    });
    return await response.json();
  }

  // 🔹 READ BY ID
  async getById(token, id) {
    const response = await this.request.get(`/todos/${id}`, {
      headers: { 'X-CHALLENGER': token }
    });
    return await response.json();
  }

  // 🔹 UPDATE (полная замена)
  async update(token, id, data) {
    const response = await this.request.put(`/todos/${id}`, {
      headers: { 'X-CHALLENGER': token },
       data
    });
    return await response.json();
  }

  // 🔹 PATCH (частичное обновление)
  async patch(token, id, updates) {
    const response = await this.request.patch(`/todos/${id}`, {
      headers: { 'X-CHALLENGER': token },
       updates
    });
    return await response.json();
  }

  // 🔹 DELETE
  async delete(token, id) {
    const response = await this.request.delete(`/todos/${id}`, {
      headers: { 'X-CHALLENGER': token }
    });
    return response.status();
  }
}