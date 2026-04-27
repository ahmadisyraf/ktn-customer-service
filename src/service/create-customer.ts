import Customer from '../model/customer';
import Api from './api';

export default class CreateCustomer {
	private customer: Customer | undefined;
	private api: Api;

	constructor(api: Api) {
		this.api = api;
	}

	public setCustomer(customer: Customer | undefined): this {
		this.customer = customer;

		return this;
	}

	public async doRequest(): Promise<Boolean> {
		if (!this.customer) {
			throw new Error('Missing customer information');
		}

		const sql = `
			INSERT
			INTO customers (firstName,
											lastName,
											email,
											password,
			                role,
			                dynamicEntity)
			SELECT ?,
						 ?,
						 ?,
						 ?,
						 ?,
						 ? WHERE NOT EXISTS (SELECT 1 FROM customers WHERE email = ? LIMIT 1)
		`;

		try {
			const result = await this.api
				.getBody()
				.database
				.prepare(sql)
				.bind(
					this.customer.firstName,
					this.customer.lastName,
					this.customer.email,
					this.customer.password,
					this.customer.role,
					JSON.stringify(this.customer.dynamicEntity),
					this.customer.email
				)
				.run();

			return result.success && result.meta.rows_written > 0;
		} catch (error) {
			throw new Error('Failed to create the customer', { cause: error });
		}
	}
}
