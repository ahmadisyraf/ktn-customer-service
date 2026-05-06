import Api from './api';
import Customer from '../model/customer';
import { HttpStatus } from '../http-status';
import ApiException from '../exception/api-exception';
import JsonUtils from '../common/json-utils';

export default class UpdateCustomer {
	private api: Api;
	private customer: Customer | undefined;

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
					metadata  = ?,
					updatedAt = CURRENT_TIMESTAMP
			WHERE email = ? RETURNING firstName, lastName, email, role, password, metadata, updatedAt, createdAt
		`;

		try {
			const { results } = await this.api
				.database
				.prepare(sql)
				.bind(
					this.customer.firstName,
					this.customer.lastName,
					this.customer.metadata ? JsonUtils.toJSON(this.customer.metadata) : '{}',
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
