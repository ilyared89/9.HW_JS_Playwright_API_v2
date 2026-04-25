// src/helpers/fixtures/fixture.js
import { test as baseTest, expect } from "@playwright/test";
import { TodoService } from '../../services/TodoService.js';
import { TodosService } from '../../services/TodosService.js';
import { ChallengerService } from '../../services/ChallengerService.js';
import { HeartbeatService } from '../../services/HeartbeatService.js';
import { SecretService } from '../../services/SecretService.js';
import { apiAssertions } from "../assertions/apiAssertions.js";
import fs from "fs";
import path from "path";

const BASE_URL = process.env.BASE_URL || "https://apichallenges.eviltester.com";

export const test = baseTest.extend({
token: async ({}, use) => {
  const tokenPath = path.join(process.cwd(), '.auth', 'token.json');
  
  if (!fs.existsSync(tokenPath)) {
    throw new Error(
      'Token file not found. Make sure globalSetup is configured in playwright.config.js'
    );
  }
  
  const tokenData = JSON.parse(fs.readFileSync(tokenPath, 'utf-8'));
  const token = tokenData.token;
  
  if (!token) {
    throw new Error('Invalid token in file');
  }
  
  console.log(`🔍 [Fixture] Using token: ${token?.slice(0, 8)}...`);
  await use(token);
},

  // 🔹 Хелпер: заголовки с токеном для всех запросов
  apiHeaders: async ({ token }, use) => {
    await use({
      'X-CHALLENGER': token,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  },

  // 🔹 Новые модульные сервисы (без токена в конструкторе)
  todoService: async ({ request }, use) => {
    await use(new TodoService(request));
  },

  todosService: async ({ request }, use) => {
    await use(new TodosService(request));
  },

  challengerService: async ({ request }, use) => {
    await use(new ChallengerService(request));
  },

  heartbeatService: async ({ request }, use) => {
    await use(new HeartbeatService(request));
  },

  secretService: async ({ request, token }, use) => {
    await use(new SecretService(request, token));
  },

  // 🔹 Legacy-алиас для обратной совместимости со старыми тестами
  // ✅ Реализован через request + token, без ссылок на удалённые классы
todoServices: async ({ request, token }, use) => {
    const baseHeaders = {
      'X-CHALLENGER': token,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    // 🔹 Хелпер: безопасный парсинг JSON
    const parseJson = async (res) => {
      try {
        return await res.json();
      } catch (e) {
        return {};
      }
    };

    const services = {
      request,
      token,
      baseURL: BASE_URL,
      baseHeaders,

      // 🔹 TODOS - CRUD (с парсингом ответов)
      createTodo: async (data) => {
        const res = await request.post('/todos', { headers: baseHeaders,  data });
        return await parseJson(res);
      },
      
      getAllTodos: async (params) => {
        const query = params ? '?' + new URLSearchParams(params).toString() : '';
        const res = await request.get(`/todos${query}`, { headers: baseHeaders });
        return await parseJson(res);
      },
      
      getTodoById: async (id) => {
        const res = await request.get(`/todos/${id}`, { headers: baseHeaders });
        return await parseJson(res);
      },
      
      getTodoByIdStatus: async (id) => {
        const res = await request.get(`/todos/${id}`, { headers: baseHeaders });
        return res.status();
      },
      
      getTodosWithDoneStatusTrue: async () => {
        const res = await request.get('/todos?doneStatus=true', { headers: baseHeaders });
        return await parseJson(res);
      },
      
      updateTodoPartial: async (id, data) => {
        const res = await request.post(`/todos/${id}`, { headers: baseHeaders,  data });
        return await parseJson(res);
      },
      
      fullUpdateTodo: async (id, data) => {
        const res = await request.put(`/todos/${id}`, { headers: baseHeaders,  data });
        return await parseJson(res);
      },
      
      fullUpdateTodoWithStatus: async (id, data) => {
        const res = await request.put(`/todos/${id}`, { headers: baseHeaders,  data });
        return { 
          status: res.status(), 
          body: await parseJson(res)
        };
      },
      
      deleteTodo: async (id) => {
        const res = await request.delete(`/todos/${id}`, { headers: baseHeaders });
        return res.status();
      },

      // 🔹 TODOS - расширенные сценарии
      createTodoWithStatus: async (data) => {
        const res = await request.post('/todos', { headers: baseHeaders,  data });
        return { 
          status: res.status(), 
          body: await parseJson(res)
        };
      },
      
      createTodoWithContentType: async (data, contentType, accept) => {
        const res = await request.post('/todos', {
          headers: { 
            ...baseHeaders, 
            'Content-Type': contentType, 
            Accept: accept 
          },
           data: contentType === 'application/xml' ? data : JSON.stringify(data)
        });
        const ct = res.headers()['content-type'] || '';
        return ct.includes('xml') ? await res.text() : await parseJson(res);
      },

      // 🔹 CHALLENGES
      getChallenges: async () => {
        const res = await request.get('/challenges', { headers: baseHeaders });
        return await parseJson(res);
      },
      
      getChallengerData: async (guid) => {
        const res = await request.get(`/challenger/${guid}`, { 
          headers: { 'X-CHALLENGER': token } 
        });
        return await parseJson(res);
      },
      
      getInvalidEndpoint: async () => {
        const res = await request.get('/todo', { headers: baseHeaders });
        return res.status();
      },

      // 🔹 HEAD / OPTIONS
      headTodos: async () => {
        const res = await request.head('/todos', { headers: baseHeaders });
        return { status: res.status(), headers: res.headers() };
      },
      
      optionsTodos: async () => {
        const res = await request.fetch('/todos', { 
          method: 'OPTIONS', 
          headers: baseHeaders 
        });
        return { status: res.status(), headers: res.headers() };
      },

      // 🔹 HEARTBEAT
      getHeartbeat: async () => {
        const res = await request.get('/heartbeat', { headers: baseHeaders });
        return res.status();
      },
      
      deleteHeartbeat: async () => {
        const res = await request.delete('/heartbeat', { headers: baseHeaders });
        return res.status();
      },
      
      patchHeartbeat: async () => {
        const res = await request.patch('/heartbeat', { headers: baseHeaders });
        return res.status();
      },

      // 🔹 SECRET / AUTH
      getSecretToken: async (username, password) => {
        const auth = Buffer.from(`${username}:${password}`).toString('base64');
        const res = await request.post('/secret/token', {
          headers: { 
            'X-CHALLENGER': token, 
            'Authorization': `Basic ${auth}`,
            'Accept': 'application/json'  
          }
        });
        return { 
          status: res.status(),  
          token: res.headers()['x-auth-token'],
          body: await res.text().catch(() => '')
        };
      },
      
      getSecretNote: async (authToken) => {
        const res = await request.get('/secret/note', {
          headers: { 
            'X-CHALLENGER': token, 
            'X-AUTH-TOKEN': authToken 
          }
        });
        return { 
          status: res.status(), 
          body: await parseJson(res)
        };
      },
      
      getSecretNoteWithStatus: async (authToken) => {
        const res = await request.get('/secret/note', {
          headers: { 
            'X-CHALLENGER': token, 
            'X-AUTH-TOKEN': authToken 
          }
        });
        return res.status();
      },
      
      postSecretNote: async (authToken, note) => {
        const res = await request.post('/secret/note', {
          headers: { 
            'X-CHALLENGER': token, 
            'X-AUTH-TOKEN': authToken 
          },
           data: { note }
        });
        return await parseJson(res);
      },

      // 🔹 Очистка для изоляции тестов
      cleanupTodosByPrefix: async (prefix = 'Test-') => {
        const res = await request.get('/todos', { headers: baseHeaders });
        const { todos } = await parseJson(res);
        const testTodos = (todos || [])
          .filter(t => t.title?.startsWith(prefix) && t.id)
          .map(t => t.id);
        
        for (const id of testTodos) {
          await request.delete(`/todos/${id}`, { headers: baseHeaders }).catch(() => {});
        }
        return { deleted: testTodos.length };
      }
    };
    
    await use(services);
  },

  // 🔹 Assertion helpers
  assert: async ({}, use) => {
    await use(apiAssertions);
  },

  // 🔹 Challenger API (для специфичных сценариев)
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
           data: JSON.stringify(data)
        });
        return response.json();
      },

      async createSession() {
        const response = await request.fetch(`${BASE_URL}/challenger`, {
          method: 'POST',
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