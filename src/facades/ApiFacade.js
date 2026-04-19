//src/facades/ApiFacade.js
import { test } from "@playwright/test";
import { TodoServices } from "../services/TodoServices.js";

export class ApiFacade {
  constructor(request, token) {
    this.todoServices = new TodoServices(request, token);
  }

  async createTodo(todo) {
    return test.step("Facade: Create todo", async () => {
      const body = await this.todoServices.createTodo(todo);
      if (!body.id) {
        throw new Error(`Failed to create todo: ${JSON.stringify(body)}`);
      }
      return body.id;
    });
  }

  async deleteTodo(id) {
    return test.step(`Facade: Delete todo ${id}`, async () => {
      const status = await this.todoServices.deleteTodo(id);
      if (status !== 200) {
        throw new Error(
          `Failed to delete todo with id ${id}, status: ${status}`,
        );
      }
    });
  }

  async getTodoById(id) {
    return test.step(`Facade: Get todo ${id}`, async () => {
      const body = await this.todoServices.getTodoById(id);
      if (!body.todos || body.todos.length === 0) {
        throw new Error(`Todo with id ${id} not found`);
      }
      return body.todos[0];
    });
  }

  async getAllTodos() {
    return test.step("Facade: Get all todos", async () => {
      const body = await this.todoServices.getAllTodos();
      return body.todos || [];
    });
  }

  async cleanupAllTodos() {
    return test.step("Facade: Cleanup all todos", async () => {
      const todos = await this.getAllTodos();
      for (const todo of todos) {
        if (todo.id) {
          await this.todoServices.deleteTodo(todo.id);
        }
      }
    });
  }

  get services() {
    return this.todoServices;
  }
}
