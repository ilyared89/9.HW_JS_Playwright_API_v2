//src/services/ChallengerService.js
export class ChallengerService {
  constructor(request) {
    this.request = request;
  }

  async createSession() {
    return this.request.post('/challenger');
  }

  async getData(guid) {
    return this.request.get(`/challenger/${guid}`);
  }
}