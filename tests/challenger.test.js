// tests/challenger.test.js

// 🔹 Глобальный лог токена для отладки (удалите после фикса)
let loggedToken = false;
test.beforeAll(async ({ token }) => {
  if (!loggedToken) {
    console.log(`🔍 [GLOBAL] All tests using token: ${token}`);
    loggedToken = true;
  }
});


import { test, expect } from "../src/helpers/fixtures/fixture.js";
import { TodoBuilder } from "../src/builders/TodoBuilder.js";

test.describe("Challenger Session", () => {
  
  test("@POST @challenge01 создать challenger сессию [Challenge 01]", async ({ challengerService }) => {
    const response = await challengerService.createSession();
    expect(response.status()).toBe(201);
    const token = response.headers()['x-challenger'];
    expect(token).toMatch(/^[0-9a-f-]{36}$/i);
  });

  test("@RESTORE @challenge34 получить данные challenger по GUID [Challenge 34]", async ({ challengerService, token }) => {
    const response = await challengerService.getData(token);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.xChallenger || body.challenger?.xChallenger).toBe(token);
    const challenges = body.challenges || body.challenger?.challenges;
    if (challenges) {
      expect(Array.isArray(challenges)).toBe(true);
    }
  });

  test("@GET @challenge02 получить список challenges [Challenge 02]", async ({ challengerService, apiHeaders }) => {
    const response = await challengerService.request.get('/challenges', { headers: apiHeaders });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.challenges).toBeDefined();
    expect(Array.isArray(body.challenges)).toBe(true);
    expect(body.challenges.length).toBeGreaterThan(0);
    const challenge02 = body.challenges.find(c => c.id === 2);
    expect(challenge02?.status).toBe(true);
  });
});