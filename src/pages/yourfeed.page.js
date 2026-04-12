export class YourfeedPage {
	constructor(page) {
		this.page = page;

		this.profileName = page.getByRole('navigation');
	}
	getProfileName() {
		return this.profileName; // возвращаем локатор, без магии
	}
}
