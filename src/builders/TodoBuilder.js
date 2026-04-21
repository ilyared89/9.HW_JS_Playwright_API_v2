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



  // 🔹 Граничные значения для валидации
  static get BOUNDARIES() {
    return {
      TITLE: { min: 1, max: 50, over: 51 },
      DESCRIPTION: { min: 0, max: 200, over: 201 },
      PAYLOAD_SIZE: { limit: 4096, over: 5000 }
    };
  }

  static titleAt(boundary) {
    const { min, max, over } = this.BOUNDARIES.TITLE;
    const length = { min, max, over }[boundary] || boundary;
    return this.generateString(length);
  }

  static descriptionAt(boundary) {
    const { min, max, over } = this.BOUNDARIES.DESCRIPTION;
    const length = { min, max, over }[boundary] || boundary;
    return this.generateString(length);
  }
 

  // Пресеты для частых сценариев
  static minimal() {
    return new TodoBuilder()
      .withTitle('T')
      .withDoneStatus(false)
      .withDescription('');
  }

  static maximal() {
    return new TodoBuilder()
      .withTitle(this.titleAt('max'))
      .withDoneStatus(true)
      .withDescription(this.descriptionAt('max'));
  }

  static invalid(type) {
    switch(type) {
      case 'missing-title':
        return { doneStatus: false, description: 'No title' };
      case 'invalid-doneStatus':
        return { title: 'Test', doneStatus: 'not-a-boolean' };
      case 'extra-field':
        return { title: 'Test', doneStatus: false, priority: 'high' };
      case 'null-title':
        return { title: null, doneStatus: false };
      default:
        return new TodoBuilder().build();
    }
  }

  // 🔹 Уникальный title для изоляции тестов
  static unique(prefix = 'Test') {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }
}

