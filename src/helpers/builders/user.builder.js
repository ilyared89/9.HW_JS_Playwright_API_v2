import { faker } from '@faker-js/faker';

export class UserBuilder {
	/* constructor()
    {
        this.role = 'admin';
    } */
	withEmail(email) {
		this.email = email ?? faker.internet.email();
		return this;
	}

	withPassword(length = 10) {
		this.password = faker.internet.password({ length: 10 });
		return this;
	}

	withUsername() {
		this.username = faker.person.fullName({ lastName: 'Bin' });
		return this;
	}

	build() {
		const result = { ...this };
		return result;
	}
}
