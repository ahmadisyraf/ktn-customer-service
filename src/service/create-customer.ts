import Customer from '../model/customer';
import Api from './api';
import bcrypt from 'bcryptjs';
import Address from '../model/address';
import Metadata from '../model/metadata';
import { HttpStatus } from '../http-status';
import JsonUtils from '../common/./json-utils';
import ApiException from '../common/api-exception';
import FieldException from '../common/field-exception';
import FieldNotExistException from '../common/field-not-exist-exception';

export default class CreateCustomer {
	private customer = new Customer();
	private metadata = new Metadata();
	private address = new Address();
	private api: Api;

	constructor(api: Api) {
		this.api = api;
	}

	public setCustomer(customer: Record<string, any>): this {
		if (!customer) {
			throw new ApiException('Customer not found!', { status: HttpStatus.BadRequest });
		}

		this.customer = Customer.newCustomerBuilder()
			.setFirstName(customer.firstName)
			.setLastName(customer.lastName)
			.setEmail(customer.email)
			.setPassword(customer.password)
			.setRole(customer.role)
			.setMetadata(Metadata.from(customer.metadata))
			.build();

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
			RETURNING firstName, lastName, email, role, password, metadata, updatedAt, createdAt
		`;

		try {
			const { results, meta } = await this.api
				.getBody()
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
			const response = Customer.from(data, {});

			return Response.json(response, { status: HttpStatus.OK });
		} catch (error) {
			if (error instanceof ApiException) {
				throw error;
			}
			throw new ApiException('Internal server error', { cause: error });
		}
	}
}
