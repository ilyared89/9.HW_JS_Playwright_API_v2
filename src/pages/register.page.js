export class RegisterPage {
  constructor(page) {
    this.page = page;
    // Техническое описание страницы - селекторы/локаторы
    this.signupButton = page.getByRole("button", { name: "Sign up" });

    this.emailInput = page.getByRole("textbox", { name: "Email" });
    this.nameInput = page.getByRole("textbox", { name: "Your Name" });
    this.passwordInput = page.getByRole("textbox", { name: "Password" });
  }

  //todo переименовать
  // бизнесовые сценарии
  async signup(user) {
    const { email, password, username } = user;

    await this.nameInput.click();
    await this.nameInput.fill(username);
    await this.emailInput.click();
    await this.emailInput.fill(email);
    await this.passwordInput.click();
    await this.passwordInput.fill(password);
    await this.signupButton.click();
  }
}
