//src/services/HeartbeatService.js
export class HeartbeatService {
  constructor(request) {
    this.request = request;
  }

  async get() {
    return this.request.get('/heartbeat');
  }

  async delete() {
    return this.request.delete('/heartbeat');
  }

  async patch() {
    return this.request.patch('/heartbeat');
  }
}