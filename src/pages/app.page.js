import { MainPage, RegisterPage, YourfeedPage } from './index';
//Фасад
export class App {
	constructor(page) {
		this.page = page;
		this.main = new MainPage(page);
		this.register = new RegisterPage(page);
		this.yourfeed = new YourfeedPage(page);
	}
}
