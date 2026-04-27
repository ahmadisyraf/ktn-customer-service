import Api from './api';
import Customer from '../model/customer';

export default class LoadCustomer {
	private api: Api;
	private email: string | undefined | null;

	constructor(api: Api) {
		this.api = api;
	}

	public setEmail(email: string | null): this {
		this.email = email;

		return this;
	}

	public async doRequest(): Promise<Customer | null> {
		if (!this.email) {
			throw new Error('Missing email');
		}

		if (!this.email.includes('@')) {
			throw new Error('Invalid email');
		}

		const sql = `SELECT firstName, lastName, email, role, metadata, updatedAt, createdAt
								 FROM customers
								 WHERE email = ? LIMIT 1`;
		try {
			const result = await this.api
				.getBody()
				.database
				.prepare(sql)
				.bind(this.email)
				.first<Customer | null>();

			return result ? Object.assign(new Customer(), result) : null;
		} catch (error) {
			throw new Error('Failed to load the customer', { cause: error });
		}
	}
}
