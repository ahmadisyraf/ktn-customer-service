import Api from './api';
import Customer from '../model/customer';
import { HttpStatus } from '../http-status';
import ApiException from '../common/api-exception';

export default class UpdateCustomer {
	private api: Api;
	private customer = new Customer();

	constructor(api: Api) {
		this.api = api;
	}

	public setCustomer(customer: Record<string, any>): this {
		if (!customer) {
			throw new ApiException('Customer not found', { status: HttpStatus.BadRequest });
		}

		this.customer = Customer.from(customer, { excludePassword: true });

		return this;
	}

	public async doRequest(): Promise<Response> {
		if (!this.customer) {
			throw new ApiException('Customer not found', { status: HttpStatus.BadRequest });
		}

		const sql = `
			UPDATE customers
			SET firstName = ?,
					lastName  = ?,
					updatedAt = CURRENT_TIMESTAMP
			WHERE email = ? RETURNING firstName, lastName, email, role, password, metadata, updatedAt, createdAt
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
				.run<any>();

			const data = results[0];
			const response = Customer.from(data, { excludePassword: true });

			return Response.json(response, { status: HttpStatus.OK });
		} catch (error) {
			if (error instanceof ApiException) {
				throw error;
			}
			throw new ApiException('Internal server error', { cause: error });
		}
	}
}
