//src/builders/TodoBuilder.js
export class TodoBuilder {
  constructor() {
    this.todo = {
      title: "Default Title",
      doneStatus: false,
      description: "",
    };
  }

  withTitle(title) {
    this.todo.title = title;
    return this;
  }

  withDoneStatus(doneStatus) {
    this.todo.doneStatus = doneStatus;
    return this;
  }

  withDescription(description) {
    this.todo.description = description;
    return this;
  }

  build() {
    return { ...this.todo };
  }

  static generateString(length) {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}
