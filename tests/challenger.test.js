// tests/challenger.test.js
import { test, expect } from "../src/helpers/fixtures/fixture.js";
import { TodoBuilder } from "../src/builders/TodoBuilder.js";

/*
//  Авто-очистка после каждого теста (изоляция!)
test.afterEach(async ({ apiFacade }) => {
  await apiFacade.cleanupTestTodos('Test-').catch(() => {});
});*/

// ==========================================
// CHALLENGER SESSION & RESTORE
// ==========================================
test.describe("Challenger Session", () => {
  test("@POST @challenge01 создать challenger сессию [Challenge 01]", async ({
    challengerApi,
  }) => {
    const { token, status } = await challengerApi.createSession();
    expect(status).toBe(201);
    expect(token).toMatch(/^[0-9a-f-]{36}$/i);
  });

  test("@RESTORE @challenge34 получить данные challenger по GUID [Challenge 34]", async ({
    todoServices,
    token,
  }) => {
    const response = await todoServices.getChallengerData(token);
    //console.log('Challenge 34 response:', JSON.stringify(response, null, 2));
    expect(response).toBeDefined();
    expect(response.xChallenger || response.challenger?.xChallenger).toBe(
      token,
    );
    const challenges = response.challenges || response.challenger?.challenges;
    if (challenges) {
      expect(Array.isArray(challenges)).toBe(true);
    }
  });

  test("@GET @challenge02 получить список challenges [Challenge 02]", async ({
    todoServices,
  }) => {
    const body = await todoServices.getChallenges();
    expect(body.challenges).toBeDefined();
    expect(Array.isArray(body.challenges)).toBe(true);
    expect(body.challenges.length).toBeGreaterThan(0);
    const challenge02 = body.challenges.find((c) => c.id === 2);
    expect(challenge02?.status).toBe(true);
  });
});
