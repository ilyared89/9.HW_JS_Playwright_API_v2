// tests/todos.test.js
import { test, expect } from "../src/helpers/fixtures/fixture.js";
import { TodoBuilder } from "../src/builders/TodoBuilder.js";

// ==========================================
// GET TODO CHALLENGES
// ==========================================
test.describe("GET Todo Challenges", () => {
  test("@GET @challenge03 получить все todos [Challenge 03]", async ({
    todoServices,
  }) => {
    const body = await todoServices.getAllTodos();
    expect(body.todos).toBeDefined();
    expect(Array.isArray(body.todos)).toBe(true);
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
    const uniqueTitle = TodoBuilder.unique("GetById");
    const payload = new TodoBuilder()
      .withTitle(uniqueTitle)
      .withDoneStatus(false)
      .withDescription("Auto test")
      .build();
    const created = await todoServices.createTodo(payload);
    const body = await todoServices.getTodoById(created.id);
    expect(body.todos).toBeDefined();
    expect(body.todos.length).toBe(1);
    expect(body.todos[0].id).toBe(created.id);
    expect(body.todos[0].title).toBe(uniqueTitle);
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
    await todoServices.createTodo(
      new TodoBuilder()
        .withTitle(TodoBuilder.unique("DoneFilter"))
        .withDoneStatus(true)
        .build(),
    );
    const body = await todoServices.getTodosWithDoneStatusTrue();
    expect(body.todos.every((t) => t.doneStatus === true)).toBe(true);
  });

  test("@GET @challenge08 HEAD запрос к /todos [Challenge 08]", async ({
    todoServices,
  }) => {
    const { status, headers } = await todoServices.headTodos();
    expect(status).toBe(200);
    expect(headers["allow"] || headers["content-type"]).toBeDefined();
  });

  test("@GET @challenge25 получить todos в формате XML [Challenge 25]", async ({
    todoServices,
  }) => {
    const response = await todoServices.request.fetch(
      `${todoServices.baseURL}/todos`,
      {
        method: "GET",
        headers: { ...todoServices.baseHeaders, Accept: "application/xml" },
      },
    );
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain("<todos>");
    expect(body).toContain("</todos>");
  });

  test("@GET @challenge26 получить todos в формате JSON [Challenge 26]", async ({
    todoServices,
  }) => {
    const body = await todoServices.getAllTodos();
    expect(body.todos).toBeDefined();
    expect(Array.isArray(body.todos)).toBe(true);
  });

  test("@GET @challenge27 получить todos с Accept: */* (200) [Challenge 27]", async ({
    todoServices,
  }) => {
    const response = await todoServices.request.fetch(
      `${todoServices.baseURL}/todos`,
      {
        method: "GET",
        headers: { "X-CHALLENGER": todoServices.token, Accept: "*/*" },
      },
    );
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.todos).toBeDefined();
    expect(response.headers()["content-type"]).toContain("application/json");
  });

  test("@GET @challenge28 предпочтительный формат XML [Challenge 28]", async ({
    todoServices,
  }) => {
    const response = await todoServices.request.fetch(
      `${todoServices.baseURL}/todos`,
      {
        method: "GET",
        headers: {
          ...todoServices.baseHeaders,
          Accept: "application/xml, application/json",
        },
      },
    );
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain("<todos>");
    expect(body).toContain("<todo>");
  });

  test("@GET @challenge29 получить todos без заголовка Accept (200) [Challenge 29]", async ({
    token,
  }) => {
    const httpsModule = await import("node:https");
    const https = httpsModule.default;
    return new Promise((resolve, reject) => {
      const options = {
        hostname: "apichallenges.eviltester.com",
        path: "/todos",
        method: "GET",
        headers: { "X-CHALLENGER": token },
      };
      const req = https.request(options, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            expect(res.statusCode).toBe(200);
            const body = JSON.parse(data);
            expect(body.todos).toBeDefined();
            expect(res.headers["content-type"]).toContain("application/json");
            resolve();
          } catch (e) {
            reject(e);
          }
        });
      });
      req.on("error", reject);
      req.end();
    });
  });

  test("@GET @challenge30 неподдерживаемый Accept header (406) [Challenge 30]", async ({
    todoServices,
  }) => {
    const response = await todoServices.request.fetch(
      `${todoServices.baseURL}/todos`,
      {
        method: "GET",
        headers: { ...todoServices.baseHeaders, Accept: "application/gzip" },
      },
    );
    expect(response.status()).toBe(406);
  });
});

// ==========================================
// POST TODO CHALLENGES
// ==========================================
test.describe("POST Todo Challenges", () => {
  test("@POST @challenge09 создать новый todo [Challenge 09]", async ({
    todoServices,
  }) => {
    const payload = new TodoBuilder()
      .withTitle(TodoBuilder.unique("Create"))
      .withDoneStatus(false)
      .withDescription("Milk, bread")
      .build();
    const body = await todoServices.createTodo(payload);
    expect(body.id).toBeDefined();
    expect(body.title).toBe(payload.title);
    expect(body.doneStatus).toBe(payload.doneStatus);
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
  });

  test("@POST @challenge11 слишком длинный title (400) [Challenge 11]", async ({
    todoServices,
  }) => {
    const longTitle = TodoBuilder.generateString(51);
    const { status, body } = await todoServices.createTodoWithStatus({
      title: longTitle,
      doneStatus: false,
    });
    expect(status).toBe(400);
    expect(body.errorMessages).toBeDefined();
  });

  test("@POST @challenge12 слишком длинный description (400) [Challenge 12]", async ({
    todoServices,
  }) => {
    const longDescription = TodoBuilder.generateString(201);
    const { status, body } = await todoServices.createTodoWithStatus({
      title: "Valid title",
      description: longDescription,
    });
    expect(status).toBe(400);
    expect(body.errorMessages).toBeDefined();
  });

  test("@POST @challenge13 максимальная длина полей (201) [Challenge 13]", async ({
    todoServices,
  }) => {
    const payload = {
      title: TodoBuilder.generateString(50),
      description: TodoBuilder.generateString(200),
      doneStatus: false,
    };
    const body = await todoServices.createTodo(payload);
    expect(body.title).toBe(payload.title);
    expect(body.description).toBe(payload.description);
  });

  test("@POST @challenge14 слишком большой payload (413) [Challenge 14]", async ({
    todoServices,
  }) => {
    const { status } = await todoServices.createTodoWithStatus({
      title: "Test",
      doneStatus: false,
      description: TodoBuilder.generateString(5000),
    });
    expect(status).toBe(413);
  });

  test("@POST @challenge15 лишнее поле в payload (400) [Challenge 15]", async ({
    todoServices,
  }) => {
    const { status, body } = await todoServices.createTodoWithStatus({
      title: "Valid title",
      doneStatus: false,
      priority: "high",
    });
    expect(status).toBe(400);
    expect(body.errorMessages).toBeDefined();
  });

  test("@POST @challenge17 обновить todo частично (POST amend) [Challenge 17]", async ({
    todoServices,
  }) => {
    const created = await todoServices.createTodo(
      new TodoBuilder()
        .withTitle(TodoBuilder.unique("Amend"))
        .withDescription("Original")
        .build(),
    );
    const updated = await todoServices.updateTodoPartial(created.id, {
      title: "Updated Title",
    });
    expect(updated.title).toBe("Updated Title");
    expect(updated.description).toBe("Original");
  });

  test("@POST @challenge18 обновить несуществующий todo (404) [Challenge 18]", async ({
    todoServices,
  }) => {
    const response = await todoServices.updateTodoPartial(999999, {
      title: "Nope",
    });
    expect(response.errorMessages || response.error).toBeDefined();
  });

  test("@POST @challenge31 создать todo с XML Content-Type [Challenge 31]", async ({
    todoServices,
  }) => {
    const xml = `<?xml version="1.0"?><todo><title>XML Todo</title><doneStatus>false</doneStatus></todo>`;
    const body = await todoServices.createTodoWithContentType(
      xml,
      "application/xml",
      "application/xml",
    );
    expect(body).toContain("<todo>");
    expect(body).toContain("<title>XML Todo</title>");
  });

  test("@POST @challenge32 создать todo с JSON Content-Type [Challenge 32]", async ({
    todoServices,
  }) => {
    const body = await todoServices.createTodoWithContentType(
      new TodoBuilder().withTitle(TodoBuilder.unique("JSON")).build(),
      "application/json",
      "application/json",
    );
    expect(body.id).toBeDefined();
  });

  test("@POST @challenge33 неподдерживаемый Content-Type (415) [Challenge 33]", async ({
    todoServices,
  }) => {
    const response = await todoServices.request.fetch(
      `${todoServices.baseURL}/todos`,
      {
        method: "POST",
        headers: { ...todoServices.baseHeaders, "Content-Type": "text/plain" },
        data: "plain text",
      },
    );
    expect(response.status()).toBe(415);
  });

  test("@POST @challenge39 XML to JSON [Challenge 39]", async ({
    todoServices,
  }) => {
    const xml = `<?xml version="1.0"?><todo><title>XML2JSON</title><doneStatus>true</doneStatus></todo>`;
    const body = await todoServices.createTodoWithContentType(
      xml,
      "application/xml",
      "application/json",
    );
    expect(body.id).toBeDefined();
    expect(body.title).toBe("XML2JSON");
  });

  test("@POST @challenge40 JSON to XML [Challenge 40]", async ({
    todoServices,
  }) => {
    const body = await todoServices.createTodoWithContentType(
      { title: "JSON2XML", doneStatus: false },
      "application/json",
      "application/xml",
    );
    expect(body).toContain("<todo>");
    expect(body).toContain("<title>JSON2XML</title>");
  });
});

// ==========================================
// PUT TODO CHALLENGES
// ==========================================
test.describe("PUT Todo Challenges", () => {
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
    const createResult = await todoServices.createTodo(
      new TodoBuilder()
        .withTitle("Original")
        .withDoneStatus(false)
        .withDescription("Original desc")
        .build(),
    );
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
    const createResult = await todoServices.createTodo(
      new TodoBuilder()
        .withTitle("Original")
        .withDoneStatus(false)
        .withDescription("Original desc")
        .build(),
    );
    const id = createResult.id;

    const { status, body } = await todoServices.fullUpdateTodoWithStatus(id, {
      title: "Updated Title Only",
    });
    expect([200, 400]).toContain(status);
    if (status === 200) {
      expect(body.title).toBe("Updated Title Only");
    }
  });

  test("@PUT @challenge21 обновление без title (400) [Challenge 21]", async ({
    todoServices,
  }) => {
    const createResult = await todoServices.createTodo(
      new TodoBuilder().withTitle("Original").build(),
    );
    const id = createResult.id;

    const { status } = await todoServices.fullUpdateTodoWithStatus(id, {
      doneStatus: true,
      description: "No title here",
    });
    expect(status).toBe(400);
  });

  test("@PUT @challenge22 обновление с несовпадающим ID (400) [Challenge 22]", async ({
    todoServices,
  }) => {
    const createResult = await todoServices.createTodo(
      new TodoBuilder().withTitle("Original").build(),
    );
    const id = createResult.id;

    const { status } = await todoServices.fullUpdateTodoWithStatus(id, {
      id: 999999,
      title: "Updated",
      doneStatus: false,
    });
    expect(status).toBe(400);
  });
});

// ==========================================
// DELETE TODO CHALLENGES
// ==========================================
test.describe("DELETE Todo Challenges", () => {
  test("@DELETE @challenge23 удалить todo по ID [Challenge 23]", async ({
    todoServices,
  }) => {
    let allTodos = await todoServices.getAllTodos();
    let id;

    if (allTodos.todos && allTodos.todos.length > 0) {
      id = allTodos.todos[0].id;
    } else {
      const createResult = await todoServices.createTodo(
        new TodoBuilder()
          .withTitle("Todo to delete " + Date.now())
          .withDoneStatus(false)
          .build(),
      );
      id = createResult.id;
    }

    expect(id).toBeDefined();
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

  test("@DELETE @challenge58 удалить все todos [Challenge 58]", async ({
    todoServices,
    token,
  }) => {
    const { todos } = await todoServices.getAllTodos();
    for (const todo of todos || []) {
      if (todo.id) await todoServices.deleteTodo(todo.id).catch(() => {});
    }
    const remaining = await todoServices.getAllTodos();
    expect(remaining.todos?.length || 0).toBe(0);
    console.log(
      `✅ Challenge 58: https://apichallenges.eviltester.com/gui/challenges/${token}`,
    );
  });
});

// ==========================================
// OPTIONS CHALLENGES
// ==========================================
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
