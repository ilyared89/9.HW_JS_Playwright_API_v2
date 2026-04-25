// tests/heartbeat.test.js

// 🔹 Глобальный лог токена для отладки (удалите после фикса)
let loggedToken = false;
test.beforeAll(async ({ token }) => {
  if (!loggedToken) {
    console.log(`🔍 [GLOBAL] All tests using token: ${token}`);
    loggedToken = true;
  }
});


import { test, expect } from "../src/helpers/fixtures/fixture.js";

test.describe("Heartbeat & Status Challenges", () => {
  
  test("@DELETE @challenge41 DELETE heartbeat возвращает 405 [Challenge 41]", async ({ heartbeatService, apiHeaders }) => {
    const response = await heartbeatService.request.delete('/heartbeat', { headers: apiHeaders });
    expect(response.status()).toBe(405);
  });

  test("@PATCH @challenge42 PATCH heartbeat возвращает 500 [Challenge 42]", async ({ heartbeatService, apiHeaders }) => {
    const response = await heartbeatService.request.patch('/heartbeat', { headers: apiHeaders });
    expect(response.status()).toBe(500);
  });

  test("@STATUS @challenge43 TRACE heartbeat возвращает 501 [Challenge 43]", async ({ request, token }) => {
    const response = await request.fetch('/heartbeat', {
      method: 'TRACE',
      headers: { 'X-CHALLENGER': token }
    });
    expect(response.status()).toBe(501);
  });

  test("@STATUS @challenge44 GET heartbeat возвращает 204 [Challenge 44]", async ({ heartbeatService, apiHeaders }) => {
    const response = await heartbeatService.request.get('/heartbeat', { headers: apiHeaders });
    expect(response.status()).toBe(204);
  });

  test("@OVERRIDE @challenge45 POST as DELETE override (405) [Challenge 45]", async ({ request, token }) => {
    const response = await request.post('/heartbeat', {
      headers: { 
        'X-CHALLENGER': token, 
        'X-HTTP-Method-Override': 'DELETE' 
      }
    });
    expect(response.status()).toBe(405);
  });

  test("@OVERRIDE @challenge46 POST as PATCH override (500) [Challenge 46]", async ({ request, token }) => {
    const response = await request.post('/heartbeat', {
      headers: { 
        'X-CHALLENGER': token, 
        'X-HTTP-Method-Override': 'PATCH' 
      }
    });
    expect(response.status()).toBe(500);
  });

  test("@OVERRIDE @challenge47 POST as TRACE override (501) [Challenge 47]", async ({ request, token }) => {
    const response = await request.post('/heartbeat', {
      headers: { 
        'X-CHALLENGER': token, 
        'X-HTTP-Method-Override': 'TRACE' 
      }
    });
    expect(response.status()).toBe(501);
  });
});