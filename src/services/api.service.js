// src/services/api.service.js
import { ChallengerService, ChallengesService, TodosService } from './index';

// 🔹 Facade: единая точка входа для всех API-операций
export class Api {
  constructor(request) {
    this.request = request;
    this.challenger = new ChallengerService(request);
    this.challenges = new ChallengesService(request);
    this.todos = new TodosService(request);
  }
}