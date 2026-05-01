import Api from './api';
import Customer from '../model/customer';
import { HttpStatus } from '../http-status';

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

	public async doRequest(): Promise<Response> {
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

			const response = result ? Object.assign(new Customer(), result) : null;

			return Response.json(response ? response.getBody() : {}, { status: HttpStatus.OK });
		} catch (error) {
			throw new Error('Failed to load customer', { cause: error });
		}
	}
}
