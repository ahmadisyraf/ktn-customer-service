import Api from './api';
import Customer from '../model/customer';
import { HttpStatus } from '../http-status';

export default class UpdateCustomer {
	private api: Api;
	private customer = new Customer();

	constructor(api: Api) {
		this.api = api;
	}

	public setCustomer(customer: Customer): this {
		this.customer.firstName = customer.firstName;
		this.customer.lastName = customer.lastName;
		this.customer.email = customer.email;

		return this;
	}

	public async doRequest(): Promise<Response> {
		if (!this.customer) {
			throw new Error('Customer not found!');
		}

		const sql = `
			UPDATE customers
			SET firstName = ?,
					lastName  = ?,
					updatedAt = CURRENT_TIMESTAMP
			WHERE email = ? RETURNING firstName, lastName, email, role, metadata, updatedAt, createdAt
		`;

		try {
			const { results } = await this.api
				.getBody()
				.database
				.prepare(sql)
				.bind(
					this.customer.firstName,
					this.customer.lastName,
					this.customer.email
				)
				.run<Customer>();

			const response =  Object.assign(new Customer(), results[0]);

			return Response.json(response.getBody(), { status: HttpStatus.OK });
		} catch (error) {
			throw new Error('Failed to update the customer', { cause: error });
		}
	}
}
