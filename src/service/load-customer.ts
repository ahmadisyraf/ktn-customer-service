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

		const sql = 'SELECT * FROM customers WHERE email = ? LIMIT 1';
		try {
			return await this.api
				.getBody()
				.database
				.prepare(sql)
				.bind(this.email)
				.first<Customer | null>();
		} catch (error) {
			throw new Error('Failed to load the customer', { cause: error });
		}
	}
}
