// src/helpers/fixtures/fixture.js
import { test as baseTest, expect } from "@playwright/test";
import { TodoServices } from "../../services/TodoServices.js";
import { ApiFacade } from "../../facades/ApiFacade.js";
import { apiAssertions } from "../assertions/apiAssertions.js";
import fs from "fs";
import path from "path";

function getToken() {
  const tokenPath = path.join(process.cwd(), ".auth", "token.json");
  if (!fs.existsSync(tokenPath)) {
    throw new Error("Token file not found. Run global setup first.");
  }
  const tokenData = JSON.parse(fs.readFileSync(tokenPath, "utf-8"));
  return tokenData.token;
}

const BASE_URL = process.env.BASE_URL || "https://apichallenges.eviltester.com";

export const test = baseTest.extend({
  token: async ({}, use) => {
    await use(getToken());
  },

  todoServices: async ({ request }, use) => {
    const services = new TodoServices(request, getToken(), BASE_URL);
    await use(services);
  },

  apiFacade: async ({ request }, use) => {
    const facade = new ApiFacade(request, getToken(), BASE_URL);
    await use(facade);
  },

  assert: async ({}, use) => {
    await use(apiAssertions);
  },

  // ✅ ИСПРАВЛЕНО: challengerApi с корректным синтаксисом
  challengerApi: async ({ request, token }, use) => {
    const api = {
      async getChallengerData(challengerToken) {
        const response = await request.fetch(`${BASE_URL}/challenger/${challengerToken}`, {
          method: 'GET',
          headers: { 'X-CHALLENGER': token }
        });
        return response.json();
      },

      async restoreSession(challengerToken, data) {
        const response = await request.fetch(`${BASE_URL}/challenger/${challengerToken}`, {
          method: 'PUT',
          headers: { 'X-CHALLENGER': token },
          data: JSON.stringify(data)  // ✅ ДОБАВЛЕНО "data:"
        });
        return response.json();
      },

      async createSession() {
        const response = await request.fetch(`${BASE_URL}/challenger`, {
          method: 'POST',
          //headers: { 'X-CHALLENGER': token }
        });
        return {
          token: response.headers()["x-challenger"],
          status: response.status(), 
          raw: response
        };
      }
    };
    await use(api);
  },
});

export { expect };