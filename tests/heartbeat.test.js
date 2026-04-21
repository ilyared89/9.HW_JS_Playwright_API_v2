// tests/heartbeat.test.js
import { test, expect } from "../src/helpers/fixtures/fixture.js";
import { TodoBuilder } from "../src/builders/TodoBuilder.js";

/*
// 🔹 Авто-очистка после каждого теста (изоляция!)
test.afterEach(async ({ apiFacade }) => {
  await apiFacade.cleanupTestTodos('Test-').catch(() => {});
});
*/

// ==========================================
// HEARTBEAT & STATUS CHALLENGES
// ==========================================
test.describe("heartbeat", () => {
  test("@DELETE @challenge41 DELETE heartbeat возвращает 405 [Challenge 41]", async ({
    todoServices,
  }) => {
    expect(await todoServices.deleteHeartbeat()).toBe(405);
  });

  test.describe("PATCH Challenges", () => {
    test("@PATCH @challenge42 PATCH heartbeat возвращает 500 [Challenge 42]", async ({
      todoServices,
    }) => {
      expect(await todoServices.patchHeartbeat()).toBe(500);
    });

    test("@STATUS @challenge43 TRACE heartbeat возвращает 501 [Challenge 43]", async ({
      request,
      token,
    }) => {
      const response = await request.fetch("/heartbeat", {
        method: "TRACE",
        headers: { "X-CHALLENGER": token },
      });
      expect(response.status()).toBe(501);
    });

    test("@STATUS @challenge44 GET heartbeat возвращает 204 [Challenge 44]", async ({
      todoServices,
    }) => {
      expect(await todoServices.getHeartbeat()).toBe(204);
    });

    test("@OVERRIDE @challenge45 POST as DELETE override (405) [Challenge 45]", async ({
      request,
      token,
    }) => {
      const response = await request.post("/heartbeat", {
        headers: { "X-CHALLENGER": token, "X-HTTP-Method-Override": "DELETE" },
      });
      expect(response.status()).toBe(405);
    });

    test("@OVERRIDE @challenge46 POST as PATCH override (500) [Challenge 46]", async ({
      request,
      token,
    }) => {
      const response = await request.post("/heartbeat", {
        headers: { "X-CHALLENGER": token, "X-HTTP-Method-Override": "PATCH" },
      });
      expect(response.status()).toBe(500);
    });

    test("@OVERRIDE @challenge47 POST as TRACE override (501) [Challenge 47]", async ({
      request,
      token,
    }) => {
      const response = await request.post("/heartbeat", {
        headers: { "X-CHALLENGER": token, "X-HTTP-Method-Override": "TRACE" },
      });
      expect(response.status()).toBe(501);
    });
  });
});
