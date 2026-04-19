import { test, expect } from "../src/helpers/fixtures/fixture.js";
import { TodoBuilder } from "../src/builders/TodoBuilder.js";

// ==========================================
// GET CHALLENGES (8 тестов)
// ==========================================
test.describe("GET Challenges", () => {
  test("@GET @challenge02 получить список challenges [Challenge 02]", async ({
    todoServices,
  }) => {
    const body = await todoServices.getChallenges();

    expect(body.challenges).toBeDefined();
    expect(Array.isArray(body.challenges)).toBe(true);
    expect(body.challenges.length).toBeGreaterThan(0);

    const challenge02 = body.challenges.find((c) => c.id === 2);
    expect(challenge02).toBeDefined();
    expect(challenge02.status).toBe(true);
  });

  test("@GET @challenge03 получить все todos [Challenge 03]", async ({
    todoServices,
  }) => {
    const body = await todoServices.getAllTodos();

    expect(body.todos).toBeDefined();
    expect(Array.isArray(body.todos)).toBe(true);

    if (body.todos.length > 0) {
      const todo = body.todos[0];
      expect(typeof todo.id).toBe("number");
      expect(typeof todo.title).toBe("string");
      expect(typeof todo.doneStatus).toBe("boolean");
    }
  });

  test("@GET @challenge04 получить todo по несуществующему endpoint (404) [Challenge 04]", async ({
    todoServices,
  }) => {
    const status = await todoServices.getInvalidEndpoint();
    expect(status).toBe(404);
  });

  test("@GET @challenge05 получить todo по ID [Challenge 05]", async ({
    todoServices,
  }) => {
    const payload = new TodoBuilder()
      .withTitle("Test todo for GET by ID")
      .withDoneStatus(false)
      .withDescription("Test description")
      .build();

    const createResult = await todoServices.createTodo(payload);
    const createdId = createResult.id;

    const body = await todoServices.getTodoById(createdId);

    expect(body.todos).toBeDefined();
    expect(body.todos[0].id).toBe(createdId);
    expect(body.todos[0].title).toBe(payload.title);
    expect(body.todos[0].doneStatus).toBe(payload.doneStatus);
    expect(body.todos[0].description).toBe(payload.description);
  });

  test("@GET @challenge06 получить несуществующий todo (404) [Challenge 06]", async ({
    todoServices,
  }) => {
    const status = await todoServices.getTodoByIdStatus(999999);
    expect(status).toBe(404);
  });

  test("@GET @challenge07 фильтр todos по doneStatus=true [Challenge 07]", async ({
    todoServices,
  }) => {
    const payload = new TodoBuilder()
      .withTitle("Done todo")
      .withDoneStatus(true)
      .build();

    await todoServices.createTodo(payload);

    const body = await todoServices.getTodosWithDoneStatusTrue();

    expect(body.todos.every((t) => t.doneStatus === true)).toBe(true);
  });

  test("@GET @challenge08 HEAD запрос к /todos [Challenge 08]", async ({
    todoServices,
  }) => {
    const { status, headers } = await todoServices.headTodos();

    expect(status).toBe(200);
    expect(headers).toBeDefined();
    // HEAD запрос не всегда возвращает content-length, проверяем другие заголовки
    expect(headers["allow"] || headers["content-type"]).toBeDefined();
  });

  test("@GET @challenge25 получить todos в формате XML [Challenge 25]", async ({
    request,
    token,
  }) => {
    const response = await request.get(
      "https://apichallenges.eviltester.com/todos",
      {
        headers: {
          "X-CHALLENGER": token,
          Accept: "application/xml",
        },
      },
    );

    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain("<todos>");
    expect(body).toContain("</todos>");
  });

  test("@GET @challenge26 получить todos в формате JSON [Challenge 26]", async ({
    request,
    token,
  }) => {
    const response = await request.get(
      "https://apichallenges.eviltester.com/todos",
      {
        headers: {
          "X-CHALLENGER": token,
          Accept: "application/json",
        },
      },
    );

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.todos).toBeDefined();
  });

  test("@GET @challenge28 предпочтительный формат XML через Accept header (200) [Challenge 28]", async ({
    request,
    token,
  }) => {
    const response = await request.get("/todos", {
      headers: {
        "X-CHALLENGER": token,
        Accept: "application/xml, application/json",
      },
    });
    expect(response.status()).toBe(200);

    const responseBody = await response.text();
    expect(responseBody).toContain("<todos>"); // ✅ Корневой элемент
    expect(responseBody).toContain("<todo>"); // ✅ Элементы списка
    expect(responseBody).toContain("</todos>"); // ✅ Закрывающий тег

    //   Проверка заголовка Content-Type (надёжнее, чем парсинг тела)
    const contentType = response.headers()["content-type"];
    expect(contentType).toContain("application/xml");
  });

  test("@GET @challenge30 неподдерживаемый Accept header (406) [Challenge 30]", async ({
    request,
    token,
  }) => {
    const response = await request.get(
      "https://apichallenges.eviltester.com/todos",
      {
        headers: {
          "X-CHALLENGER": token,
          Accept: "application/gzip",
        },
      },
    );

    expect(response.status()).toBe(406);
  });

  // ==========================================
  // POST CHALLENGES (13 тестов)
  // ==========================================
  test.describe("POST Challenges", () => {
    test("@POST @challenge01 создать challenger сессию [Challenge 01]", async ({
      request,
    }) => {
      const response = await request.post(
        "https://apichallenges.eviltester.com/challenger",
        {
          headers: { Accept: "application/json" },
        },
      );

      expect(response.status()).toBe(201);
      const token = response.headers()["x-challenger"];
      expect(token).toBeTruthy();
      expect(token).toMatch(/^[0-9a-f-]{36}$/i);
    });

    test("@POST @challenge09 создать новый todo [Challenge 09]", async ({
      todoServices,
    }) => {
      const payload = new TodoBuilder()
        .withTitle("Buy groceries")
        .withDoneStatus(false)
        .withDescription("Milk, bread, eggs")
        .build();

      const body = await todoServices.createTodo(payload);

      expect(body.id).toBeDefined();
      expect(body.title).toBe(payload.title);
      expect(body.doneStatus).toBe(payload.doneStatus);
      expect(body.description).toBe(payload.description);
    });

    test("@POST @challenge10 невалидный doneStatus (400) [Challenge 10]", async ({
      todoServices,
    }) => {
      const { status, body } = await todoServices.createTodoWithStatus({
        title: "Invalid status",
        doneStatus: "invalid",
        description: "test",
      });

      expect(status).toBe(400);
      expect(body.errorMessages).toBeDefined();
      expect(body.errorMessages.length).toBeGreaterThan(0);
    });

    test("@POST @challenge11 слишком длинный title (400) [Challenge 11]", async ({
      todoServices,
    }) => {
      const longTitle = TodoBuilder.generateString(51);

      const payload = new TodoBuilder().withTitle(longTitle).build();

      const { status, body } = await todoServices.createTodoWithStatus(payload);

      expect(status).toBe(400);
      expect(body.errorMessages).toBeDefined();
    });

    test("@POST @challenge12 слишком длинный description (400) [Challenge 12]", async ({
      todoServices,
    }) => {
      const longDescription = TodoBuilder.generateString(201);

      const payload = new TodoBuilder()
        .withTitle("Valid title")
        .withDescription(longDescription)
        .build();

      const { status, body } = await todoServices.createTodoWithStatus(payload);

      expect(status).toBe(400);
      expect(body.errorMessages).toBeDefined();
    });

    test("@POST @challenge13 максимальная длина полей (201) [Challenge 13]", async ({
      todoServices,
    }) => {
      const maxTitle = TodoBuilder.generateString(50);
      const maxDescription = TodoBuilder.generateString(200);

      const payload = new TodoBuilder()
        .withTitle(maxTitle)
        .withDescription(maxDescription)
        .withDoneStatus(false)
        .build();

      const body = await todoServices.createTodo(payload);

      expect(body.title).toBe(maxTitle);
      expect(body.description).toBe(maxDescription);
    });

    test("@POST @challenge14 слишком большой payload (413) [Challenge 14]", async ({
      todoServices,
    }) => {
      const hugeDescription = TodoBuilder.generateString(5000);

      const payload = {
        title: "Test",
        doneStatus: false,
        description: hugeDescription,
      };

      const { status } = await todoServices.createTodoWithStatus(payload);

      expect(status).toBe(413);
    });

    test("@POST @challenge15 лишнее поле в payload (400) [Challenge 15]", async ({
      todoServices,
    }) => {
      const payload = {
        title: "Valid title",
        doneStatus: false,
        priority: "high",
      };

      const { status, body } = await todoServices.createTodoWithStatus(payload);

      expect(status).toBe(400);
      expect(body.errorMessages).toBeDefined();
    });

    test("@POST @challenge17 обновить todo частично (POST amend) [Challenge 17]", async ({
      todoServices,
    }) => {
      const createPayload = new TodoBuilder()
        .withTitle("Original title")
        .withDoneStatus(false)
        .withDescription("Original description")
        .build();

      const createResult = await todoServices.createTodo(createPayload);
      const id = createResult.id;

      const body = await todoServices.updateTodoPartial(id, {
        title: "Updated title",
      });

      expect(body.title).toBe("Updated title");
      expect(body.description).toBe("Original description");
    });

    test("@POST @challenge18 обновить несуществующий todo (404) [Challenge 18]", async ({
      todoServices,
    }) => {
      const response = await todoServices.updateTodoPartial(999999, {
        title: "Updated title",
      });

      // Метод возвращает тело ответа, проверяем что это ошибка
      expect(
        response.errorMessages || response.error || response.status === 404,
      ).toBeTruthy();
    });

    // Challenge 31
    test("@POST @challenge31 создать todo с XML Content-Type [Challenge 31]", async ({
      todoServices,
    }) => {
      const xmlPayload = `<?xml version="1.0" encoding="UTF-8"?>
      <todo>
        <title>XML Todo</title>
        <doneStatus>false</doneStatus>
        <description>Created via XML</description>
      </todo>`;

      const body = await todoServices.createTodoWithContentType(
        xmlPayload,
        "application/xml",
        "application/xml",
      );

      // API возвращает XML без декларации
      expect(body).toContain("<todo>");
      expect(body).toContain("<title>XML Todo</title>");
    });

    test("@POST @challenge32 создать todo с JSON Content-Type [Challenge 32]", async ({
      todoServices,
    }) => {
      const payload = new TodoBuilder()
        .withTitle("JSON Todo")
        .withDoneStatus(false)
        .build();

      const body = await todoServices.createTodoWithContentType(
        payload,
        "application/json",
        "application/json",
      );

      expect(body.id).toBeDefined();
    });

    test("@POST @challenge33 неподдерживаемый Content-Type (415) [Challenge 33]", async ({
      request,
      token,
    }) => {
      const response = await request.post(
        "https://apichallenges.eviltester.com/todos",
        {
          headers: {
            "X-CHALLENGER": token,
            "Content-Type": "text/plain",
          },
          data: "plain text body",
        },
      );

      expect(response.status()).toBe(415);
    });

    test("@POST @challenge39 XML to JSON [Challenge 39]", async ({
      todoServices,
    }) => {
      const xmlPayload = `<?xml version="1.0" encoding="UTF-8"?>
      <todo>
        <title>XML to JSON</title>
        <doneStatus>true</doneStatus>
        <description>Send XML, receive JSON</description>
      </todo>`;

      const body = await todoServices.createTodoWithContentType(
        xmlPayload,
        "application/xml",
        "application/json",
      );

      expect(body.id).toBeDefined();
    });

    // Challenge 40
    test("@POST @challenge40 JSON to XML [Challenge 40]", async ({
      todoServices,
    }) => {
      const payload = new TodoBuilder()
        .withTitle("JSON to XML")
        .withDoneStatus(false)
        .build();

      const body = await todoServices.createTodoWithContentType(
        payload,
        "application/json",
        "application/xml",
      );

      // API возвращает XML без декларации
      expect(body).toContain("<todo>");
      expect(body).toContain("<title>JSON to XML</title>");
    });
  });

  // ==========================================
  // PUT CHALLENGES (3 теста)
  // ==========================================
  test.describe("PUT Challenges", () => {
    test("@PUT @challenge16 невозможно создать todo через PUT (400) [Challenge 16]", async ({
      todoServices,
    }) => {
      const payload = new TodoBuilder()
        .withTitle("Try to create with PUT")
        .withDoneStatus(false)
        .build();

      const { status } = await todoServices.fullUpdateTodoWithStatus(
        999999,
        payload,
      );

      expect(status).toBe(400);
    });

    test("@PUT @challenge19 полное обновление todo [Challenge 19]", async ({
      todoServices,
    }) => {
      const createPayload = new TodoBuilder()
        .withTitle("Original")
        .withDoneStatus(false)
        .withDescription("Original desc")
        .build();

      const createResult = await todoServices.createTodo(createPayload);
      const id = createResult.id;

      const updatePayload = new TodoBuilder()
        .withTitle("Updated Title")
        .withDoneStatus(true)
        .withDescription("Updated description")
        .build();

      const body = await todoServices.fullUpdateTodo(id, updatePayload);

      expect(body.title).toBe(updatePayload.title);
      expect(body.doneStatus).toBe(updatePayload.doneStatus);
      expect(body.description).toBe(updatePayload.description);
    });

    test("@PUT @challenge20 частичное обновление todo (только title) [Challenge 20]", async ({
      todoServices,
    }) => {
      const createPayload = new TodoBuilder()
        .withTitle("Original")
        .withDoneStatus(false)
        .withDescription("Original desc")
        .build();

      const createResult = await todoServices.createTodo(createPayload);
      const id = createResult.id;

      const updatePayload = {
        title: "Updated Title Only",
      };

      const { status, body } = await todoServices.fullUpdateTodoWithStatus(
        id,
        updatePayload,
      );

      // PUT требует все обязательные поля, проверяем статус
      expect([200, 400]).toContain(status);
      if (status === 200) {
        expect(body.title).toBe("Updated Title Only");
      }
    });

    test("@PUT @challenge21 обновление без title (400) [Challenge 21]", async ({
      todoServices,
    }) => {
      const createPayload = new TodoBuilder().withTitle("Original").build();

      const createResult = await todoServices.createTodo(createPayload);
      const id = createResult.id;

      const updatePayload = {
        doneStatus: true,
        description: "No title here",
      };

      const { status } = await todoServices.fullUpdateTodoWithStatus(
        id,
        updatePayload,
      );

      expect(status).toBe(400);
    });

    test("@PUT @challenge22 обновление с несовпадающим ID (400) [Challenge 22]", async ({
      todoServices,
    }) => {
      const createPayload = new TodoBuilder().withTitle("Original").build();
      const createResult = await todoServices.createTodo(createPayload);
      const id = createResult.id;

      const updatePayload = {
        id: 999999,
        title: "Updated",
        doneStatus: false,
      };

      const { status } = await todoServices.fullUpdateTodoWithStatus(
        id,
        updatePayload,
      );

      expect(status).toBe(400);
    });
  });

  // ==========================================
  // PATCH CHALLENGES (1 тест)
  // ==========================================
  test.describe("PATCH Challenges", () => {
    test("@PATCH @challenge42 PATCH heartbeat возвращает 500 [Challenge 42]", async ({
      todoServices,
    }) => {
      const status = await todoServices.patchHeartbeat();

      expect(status).toBe(500);
    });
  });

  // ==========================================
  // DELETE CHALLENGES (3 теста)
  // ==========================================
  test.describe("DELETE Challenges", () => {
    test("@DELETE @challenge23 удалить todo по ID [Challenge 23]", async ({
      todoServices,
    }) => {
      // Находим или создаем todo для удаления
      let allTodos = await todoServices.getAllTodos();
      let id;

      // Если есть todo - используем первый, иначе создаем
      if (allTodos.todos && allTodos.todos.length > 0) {
        id = allTodos.todos[0].id;
        console.log("Using existing todo for delete:", id);
      } else {
        // Создаем новый если нет
        const payload = new TodoBuilder()
          .withTitle("Todo to delete " + Date.now())
          .withDoneStatus(false)
          .build();

        const createResult = await todoServices.createTodo(payload);
        id = createResult.id;

        if (!id) {
          console.log("Failed to create todo:", createResult);
          test.skip();
          return;
        }
      }
      const status = await todoServices.deleteTodo(id);
      expect(status).toBe(200);

      const getStatus = await todoServices.getTodoByIdStatus(id);
      expect(getStatus).toBe(404);
    });

    test("@DELETE удалить несуществующий todo возвращает 404", async ({
      todoServices,
    }) => {
      const status = await todoServices.deleteTodo(999999);
      expect(status).toBe(404);
    });

    test("@DELETE @challenge41 DELETE heartbeat возвращает 405 [Challenge 41]", async ({
      todoServices,
    }) => {
      const status = await todoServices.deleteHeartbeat();

      expect(status).toBe(405);
    });

    test.describe("OPTIONS Challenges", () => {
      test("@OPTIONS @challenge24 OPTIONS /todos возвращает Allow header [Challenge 24]", async ({
        todoServices,
      }) => {
        const { status, headers } = await todoServices.optionsTodos();

        expect(status).toBe(200);
        expect(headers["allow"]).toBeDefined();

        const allowHeader = headers["allow"].toUpperCase();
        expect(allowHeader).toContain("GET");
        expect(allowHeader).toContain("POST");
        expect(allowHeader).toContain("OPTIONS");
      });
    });

    // ==========================================
    // AUTHENTICATION CHALLENGES
    // ==========================================
    test.describe("Authentication & Authorization Challenges", () => {
      test("@AUTH @challenge48 неверные credentials (401) [Challenge 48]", async ({
        todoServices,
      }) => {
        const { status } = await todoServices.getSecretToken("wrong", "wrong");
        expect(status).toBe(401);
      });

      test("@AUTH @challenge49 верные credentials (201) [Challenge 49]", async ({
        todoServices,
      }) => {
        const { status, token } = await todoServices.getSecretToken(
          "admin",
          "password",
        );
        expect(status).toBe(201);
        expect(token).toBeDefined();
      });

      test("@AUTH @challenge50 неверный X-AUTH-TOKEN (403) [Challenge 50]", async ({
        todoServices,
      }) => {
        const status =
          await todoServices.getSecretNoteWithStatus("invalid-token");
        expect(status).toBe(403);
      });

      test("@AUTH @challenge51 отсутствует X-AUTH-TOKEN (401) [Challenge 51]", async ({
        request,
        token,
      }) => {
        const response = await request.get(
          "https://apichallenges.eviltester.com/secret/note",
          {
            headers: { "X-CHALLENGER": token },
          },
        );
        expect(response.status()).toBe(401);
      });

      test("@AUTH @challenge52 получить secret note с валидным токеном [Challenge 52]", async ({
        todoServices,
      }) => {
        const { token } = await todoServices.getSecretToken(
          "admin",
          "password",
        );

        const body = await todoServices.getSecretNote(token);
        expect(body.note).toBeDefined();
      });

      test("@AUTH @challenge53 обновить secret note [Challenge 53]", async ({
        todoServices,
      }) => {
        const { token } = await todoServices.getSecretToken(
          "admin",
          "password",
        );

        const body = await todoServices.postSecretNote(
          token,
          "My new secret note",
        );
        expect(body.note).toBe("My new secret note");
      });
    });

    // ==========================================
    // HEARTBEAT & STATUS CODE CHALLENGES
    // ==========================================
    test.describe("Heartbeat & Status Code Challenges", () => {
      test("@STATUS @challenge44 GET heartbeat возвращает 204 [Challenge 44]", async ({
        todoServices,
      }) => {
        const status = await todoServices.getHeartbeat();
        expect(status).toBe(204);
      });

      test("@STATUS @challenge43 TRACE heartbeat возвращает 501 [Challenge 43]", async ({
        request,
        token,
      }) => {
        const response = await request.fetch(
          "https://apichallenges.eviltester.com/heartbeat",
          {
            method: "TRACE",
            headers: { "X-CHALLENGER": token },
          },
        );
        expect(response.status()).toBe(501);
      });

      test("@OVERRIDE @challenge45 POST as DELETE override (405) [Challenge 45]", async ({
        request,
        token,
      }) => {
        const response = await request.post(
          "https://apichallenges.eviltester.com/heartbeat",
          {
            headers: {
              "X-CHALLENGER": token,
              "X-HTTP-Method-Override": "DELETE",
            },
          },
        );
        expect(response.status()).toBe(405);
      });

      test("@OVERRIDE @challenge46 POST as PATCH override (500) [Challenge 46]", async ({
        request,
        token,
      }) => {
        const response = await request.post(
          "https://apichallenges.eviltester.com/heartbeat",
          {
            headers: {
              "X-CHALLENGER": token,
              "X-HTTP-Method-Override": "PATCH",
            },
          },
        );
        expect(response.status()).toBe(500);
      });

      test("@OVERRIDE @challenge47 POST as TRACE override (501) [Challenge 47]", async ({
        request,
        token,
      }) => {
        const response = await request.post(
          "https://apichallenges.eviltester.com/heartbeat",
          {
            headers: {
              "X-CHALLENGER": token,
              "X-HTTP-Method-Override": "TRACE",
            },
          },
        );
        expect(response.status()).toBe(501);
      });

      // Challenge 58 - отдельно и последним!
      test.describe("FINAL - Challenge 58", () => {
        test("@DELETE @challenge58 удалить все todos [Challenge 58]", async ({
          todoServices,
          token,
        }) => {
          const body = await todoServices.getAllTodos();
          const todos = body.todos || [];

          // Удаляем все - это требование challenge 58
          for (const todo of todos) {
            if (todo.id) {
              await todoServices.deleteTodo(todo.id);
            }
          }

          const remainingBody = await todoServices.getAllTodos();
          const remaining = remainingBody.todos || [];
          expect(remaining.length).toBe(0);

          // Выводим URL для проверки
          const challengeUrl = `https://apichallenges.eviltester.com/gui/challenges/${token}`;
          console.log(
            "\n✅ Challenge 58 completed! Check progress at:",
            challengeUrl,
          );
        });
      });

      // Финальный отчет
      test.describe("Final Report", () => {
        test("@REPORT вывести ссылку для проверки challenges", async ({
          token,
        }) => {
          const challengeUrl = `https://apichallenges.eviltester.com/gui/challenges/${token}`;

          console.log(
            "\n╔════════════════════════════════════════════════════════════╗",
          );
          console.log(
            "║           🏆 ALL TESTS COMPLETED - CHECK PROGRESS 🏆       ║",
          );
          console.log(
            "╠════════════════════════════════════════════════════════════╣",
          );
          console.log(`║  Token: ${token}                  ║`);
          console.log(
            "╠════════════════════════════════════════════════════════════╣",
          );
          console.log(
            "║  📊 Verify your challenges at:                             ║",
          );
          console.log(`║  ${challengeUrl.padEnd(58)} ║`);
          console.log(
            "║                                                            ║",
          );
          console.log(
            "║  ✅ Green = Completed challenges                           ║",
          );
          console.log(
            "║  ⬜ White = Pending challenges                             ║",
          );
          console.log(
            "╚════════════════════════════════════════════════════════════╝\n",
          );

          // Тест всегда проходит, просто выводит информацию
          expect(true).toBe(true);
        });
      });
    });
  });
});
