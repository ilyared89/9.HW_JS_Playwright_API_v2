// src/helpers/builders/api.builder.js

export class ApiBuilder {
  constructor() {
    // 🔹 Значения по умолчанию (как в user.builder.js)
    this._data = {
      title: "Default Todo",
      doneStatus: false,
      description: "No description",
    };
  }

  // 🔹 Fluent-методы (возвращают this для цепочки)
  withTitle(title) {
    this._data.title = title;
    return this;
  }

  withDoneStatus(doneStatus) {
    this._data.doneStatus = doneStatus;
    return this;
  }

  withDescription(description) {
    this._data.description = description;
    return this;
  }

  // 🔹 Финальный метод — возвращает готовый объект
  build() {
    // 🔹 Возвращаем копию, чтобы избежать мутаций
    return { ...this._data };
  }

  // 🔹 Статический метод для удобного создания (опционально)
  static create() {
    return new ApiBuilder();
  }
}
