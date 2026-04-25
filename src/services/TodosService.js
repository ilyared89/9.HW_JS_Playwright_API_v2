//src/services/TodosService.js
export class TodosService {
  constructor(request) {
    this.request = request;
  }

  async getAll(params) {
    return this.request.get('/todos', { params });
  }

  async head() {
    return this.request.head('/todos');
  }

  async options() {
    return this.request.fetch('/todos', { method: 'OPTIONS' });
  }
}