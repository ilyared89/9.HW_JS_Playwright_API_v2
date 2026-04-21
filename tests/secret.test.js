// tests/secret.test.js
import { test, expect } from "../src/helpers/fixtures/fixture.js";
import { TodoBuilder } from "../src/builders/TodoBuilder.js";

/*
test.afterEach(async ({ apiFacade }) => {
  await apiFacade.cleanupTestTodos('Test-').catch(() => {});
});
*/

// ==========================================
// AUTHENTICATION CHALLENGES
// ==========================================
test.describe("Authentication Challenges", () => {
  test("@AUTH @challenge48 неверные credentials (401) [Challenge 48]", async ({
    todoServices,
  }) => {
    const { status } = await todoServices.getSecretToken("wrong", "wrong");
    expect(status).toBe(401);
  });

  test("@AUTH @challenge49 верные credentials (201) [Challenge 49]", async ({
    todoServices,
  }) => {
    const { status, token: authToken } = await todoServices.getSecretToken(
      "admin",
      "password",
    );
    expect([200, 201]).toContain(status);
    expect(authToken).toBeDefined();
  });

  test("@AUTH @challenge50 неверный X-AUTH-TOKEN (403) [Challenge 50]", async ({
    todoServices,
  }) => {
    const status =
      await todoServices.getSecretNoteWithStatus("invalid-token-xyz");
    expect([401, 403]).toContain(status);
  });

  test("@AUTH @challenge51 отсутствует X-AUTH-TOKEN (401) [Challenge 51]", async ({
    request,
    token,
  }) => {
    const response = await request.fetch("/secret/note", {
      method: "GET",
      headers: { "X-CHALLENGER": token },
    });
    expect(response.status()).toBe(401);
  });

  test("@POST @challenge53 создать secret note с валидным X-AUTH-TOKEN (200) [Challenge 53]", async ({
    todoServices,
  }) => {
    const { token: authToken, status: authStatus } =
      await todoServices.getSecretToken("admin", "password");
    expect([200, 201]).toContain(authStatus);
    expect(authToken).toBeDefined();

    const noteText = "Secret-" + Date.now();
    const body = await todoServices.postSecretNote(authToken, noteText);
    expect(body.note).toBe(noteText);
  });

  test("@AUTH @challenge52 получить secret note с валидным токеном [Challenge 52]", async ({
    todoServices,
  }) => {
    const { token: authToken } = await todoServices.getSecretToken(
      "admin",
      "password",
    );
    if (!authToken) {
      test.skip("No auth token");
      return;
    }

    const { status, body } = await todoServices.getSecretNote(authToken);

    console.log("Challenge 52 status:", status, "body:", JSON.stringify(body));

    expect(status).toBe(200);
    expect(body).toBeDefined();
    expect(body.note).toBeDefined();
  });
});
