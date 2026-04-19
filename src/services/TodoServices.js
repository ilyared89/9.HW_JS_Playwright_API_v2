//src/services/TodoServices.js
import { test } from "@playwright/test";

export class TodoServices {
  constructor(request, token) {
    this.request = request;
    this.token = token;
    this.baseURL = "https://apichallenges.eviltester.com";
    this.baseHeaders = {
      "X-CHALLENGER": this.token,
      Accept: "application/json",
      "Content-Type": "application/json",
    };
  }

  async getAllTodos(params) {
    return test.step("GET /todos", async () => {
      const response = await this.request.get(`${this.baseURL}/todos`, {
        headers: this.baseHeaders,
        params: params,
      });
      return await response.json();
    });
  }

  async getTodoById(id) {
    return test.step(`GET /todos/${id}`, async () => {
      const response = await this.request.get(`${this.baseURL}/todos/${id}`, {
        headers: this.baseHeaders,
      });
      return await response.json();
    });
  }

  async getTodoByIdStatus(id) {
    return test.step(`GET /todos/${id} (status check)`, async () => {
      const response = await this.request.get(`${this.baseURL}/todos/${id}`, {
        headers: this.baseHeaders,
      });
      return response.status();
    });
  }

  async getTodosWithDoneStatusTrue() {
    return test.step("GET /todos?doneStatus=true", async () => {
      const response = await this.request.get(`${this.baseURL}/todos`, {
        headers: this.baseHeaders,
        params: { doneStatus: true },
      });
      return await response.json();
    });
  }

  async getChallenges() {
    return test.step("GET /challenges", async () => {
      const response = await this.request.get(`${this.baseURL}/challenges`, {
        headers: this.baseHeaders,
      });
      return await response.json();
    });
  }

  async getHeartbeat() {
    return test.step("GET /heartbeat", async () => {
      const response = await this.request.get(`${this.baseURL}/heartbeat`, {
        headers: this.baseHeaders,
      });
      return response.status();
    });
  }

  async getInvalidEndpoint() {
    return test.step("GET /todo (invalid endpoint)", async () => {
      const response = await this.request.get(`${this.baseURL}/todo`, {
        headers: this.baseHeaders,
      });
      return response.status();
    });
  }

  async headTodos() {
    return test.step("HEAD /todos", async () => {
      const response = await this.request.head(`${this.baseURL}/todos`, {
        headers: this.baseHeaders,
      });
      return {
        status: response.status(),
        headers: response.headers(),
      };
    });
  }

  async createTodo(data) {
    return test.step("POST /todos", async () => {
      const response = await this.request.post(`${this.baseURL}/todos`, {
        headers: this.baseHeaders,
        data: data,
      });
      const body = await response.json();
      console.log("POST /todos response:", JSON.stringify(body)); // Временно для отладки
      return body;
    });
    //return await response.json();
    //});
  }

  async createTodoWithStatus(data) {
    return test.step("POST /todos (with status)", async () => {
      const response = await this.request.post(`${this.baseURL}/todos`, {
        headers: this.baseHeaders,
        data: data,
      });
      return {
        status: response.status(),
        body: await response.json(),
      };
    });
  }

  async updateTodoPartial(id, data) {
    return test.step(`POST /todos/${id} (amend)`, async () => {
      const response = await this.request.post(`${this.baseURL}/todos/${id}`, {
        headers: this.baseHeaders,
        data: data,
      });
      return await response.json();
    });
  }

  async createTodoWithContentType(data, contentType, accept) {
    return test.step(`POST /todos (${contentType} -> ${accept})`, async () => {
      const response = await this.request.post(`${this.baseURL}/todos`, {
        headers: {
          ...this.baseHeaders,
          "Content-Type": contentType,
          Accept: accept,
        },
        data: data,
      });
      const contentTypeHeader = response.headers()["content-type"] || "";
      if (contentTypeHeader.includes("xml")) {
        return await response.text();
      }
      return await response.json();
    });
  }

  async fullUpdateTodo(id, data) {
    return test.step(`PUT /todos/${id}`, async () => {
      const response = await this.request.put(`${this.baseURL}/todos/${id}`, {
        headers: this.baseHeaders,
        data: data,
      });
      return await response.json();
    });
  }

  async fullUpdateTodoWithStatus(id, data) {
    return test.step(`PUT /todos/${id} (with status)`, async () => {
      const response = await this.request.put(`${this.baseURL}/todos/${id}`, {
        headers: this.baseHeaders,
        data: data,
      });
      return {
        status: response.status(),
        body: await response.json(),
      };
    });
  }

  async patchHeartbeat() {
    return test.step("PATCH /heartbeat", async () => {
      const response = await this.request.patch(`${this.baseURL}/heartbeat`, {
        headers: this.baseHeaders,
      });
      return response.status();
    });
  }

  async deleteTodo(id) {
    return test.step(`DELETE /todos/${id}`, async () => {
      const response = await this.request.delete(
        `${this.baseURL}/todos/${id}`,
        {
          headers: this.baseHeaders,
        },
      );
      return response.status();
    });
  }

  async deleteHeartbeat() {
    return test.step("DELETE /heartbeat", async () => {
      const response = await this.request.delete(`${this.baseURL}/heartbeat`, {
        headers: this.baseHeaders,
      });
      return response.status();
    });
  }

  async optionsTodos() {
    return test.step("OPTIONS /todos", async () => {
      const response = await this.request.fetch(`${this.baseURL}/todos`, {
        method: "OPTIONS",
        headers: this.baseHeaders,
      });
      return {
        status: response.status(),
        headers: response.headers(),
      };
    });
  }

  async getSecretToken(username, password) {
    return test.step("POST /secret/token", async () => {
      const auth = Buffer.from(`${username}:${password}`).toString("base64");
      const response = await this.request.post(`${this.baseURL}/secret/token`, {
        headers: {
          ...this.baseHeaders,
          Authorization: `Basic ${auth}`,
        },
      });
      return {
        status: response.status(),
        token: response.headers()["x-auth-token"],
      };
    });
  }

  async getSecretNote(authToken) {
    return test.step("GET /secret/note", async () => {
      const response = await this.request.get(`${this.baseURL}/secret/note`, {
        headers: {
          ...this.baseHeaders,
          "X-AUTH-TOKEN": authToken,
        },
      });
      return await response.json();
    });
  }

  async getSecretNoteWithStatus(authToken) {
    return test.step("GET /secret/note (with status)", async () => {
      const response = await this.request.get(`${this.baseURL}/secret/note`, {
        headers: {
          ...this.baseHeaders,
          "X-AUTH-TOKEN": authToken,
        },
      });
      return response.status();
    });
  }

  async postSecretNote(authToken, note) {
    return test.step("POST /secret/note", async () => {
      const response = await this.request.post(`${this.baseURL}/secret/note`, {
        headers: {
          ...this.baseHeaders,
          "X-AUTH-TOKEN": authToken,
        },
        data: { note },
      });
      return await response.json();
    });
  }

  // ✅ НОВЫЙ МЕТОД: Получить данные challenger по токену
  async getChallengerData(challengerToken) {
    const response = await this.request(
      "GET",
      `/challenger/${challengerToken}`,
    );
    return response.json();
  }

  // ✅ ОПЦИОНАЛЬНО: Восстановить сессию (PUT)
  async restoreChallengerSession(challengerToken, sessionData) {
    const response = await this.request(
      "PUT",
      `/challenger/${challengerToken}`,
      {
        data: JSON.stringify(sessionData),
      },
    );
    return response.json();
  }
}
