//src/services/TodoService.js
export class TodoService {
  constructor(request) {
    this.request = request;
  }

  async create(data) {
    return this.request.post('/todos', { data });
  }

  async getById(id) {
    return this.request.get(`/todos/${id}`);
  }

  async update(id, data) {
    return this.request.put(`/todos/${id}`, { data });
  }

  async delete(id) {
    return this.request.delete(`/todos/${id}`);
  }
}