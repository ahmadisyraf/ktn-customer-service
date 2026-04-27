import Api from './api';
import Customer from '../model/customer';

export default class UpdateCustomer {
	private api: Api;
	private customer: Customer | undefined | null;

	constructor(api: Api) {
		this.api = api;
	}

	public setCustomer(customer: Customer): this {
		this.customer = customer;

		return this;
	}

	public async doRequest(): Promise<Boolean> {
		if (!this.customer) {
			throw new Error('Customer not found!');
		}

		const sql = `
			UPDATE customers
			SET firstName = ?,
					lastName  = ?,
					updatedAt = CURRENT_TIMESTAMP
			WHERE email = ?`;

		try {
			const result = await this.api
				.getBody()
				.database
				.prepare(sql)
				.bind(
					this.customer.firstName,
					this.customer.lastName,
					this.customer.email
				)
				.run();

			return result.success && result.meta.changes > 0;
		} catch (error) {
			throw new Error('Failed to update the customer', { cause: error });
		}
	}
}
