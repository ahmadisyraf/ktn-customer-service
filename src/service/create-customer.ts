import Customer from '../model/customer';
import Api from './api';
import { HttpStatus } from '../http-status';
import JsonUtils from '../common/./json-utils';
import ApiException from '../exception/api-exception';

export default class CreateCustomer {
	private customer: Customer | undefined;
	private api: Api;

	constructor(api: Api) {
		this.api = api;
	}

	public setCustomer(customer: Record<string, any>): this {
		if (!customer) {
			throw new ApiException('Customer not found!', { status: HttpStatus.BadRequest });
		}

		this.customer = Customer.from(customer);

		return this;
	}

	public async doRequest(): Promise<Response> {
		if (!this.customer) {
			throw new ApiException('Customer not found', { status: HttpStatus.BadRequest });
		}

		const sql = `
			INSERT
			INTO customers (firstName,
											lastName,
											email,
											password,
											role,
											metadata)
			SELECT ?,
						 ?,
						 ?,
						 ?,
						 ?,
						 ? WHERE NOT EXISTS (SELECT 1 FROM customers WHERE email = ? LIMIT 1)
			RETURNING firstName, lastName, email, role, metadata, updatedAt, createdAt
		`;

		try {
			const { results, meta } = await this.api
				.database
				.prepare(sql)
				.bind(
					this.customer.firstName,
					this.customer.lastName,
					this.customer.email,
					this.customer.password,
					this.customer.role,
					this.customer.metadata ? JsonUtils.toJSON(this.customer.metadata) : '{}',
					this.customer.email
				)
				.run<any>();

			if (meta.rows_written === 0) {
				throw new ApiException('Customer already exist', { status: HttpStatus.BadRequest });
			}

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
