import Customer from '../model/customer';
import Api from './api';
import bcrypt from 'bcryptjs';
import Address from '../model/address';
import Metadata from '../model/metadata';
import { HttpStatus } from '../http-status';
import Utils from '../common/utils';
import ApiException from '../common/api-exception';

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

		this.customer.firstName = customer.firstName;
		this.customer.lastName = customer.lastName;

		if (customer.email.includes('@') == false) {
			throw new Error('Invalid email address');
		}

		this.customer.email = customer.email;
		this.customer.role = customer.role;

		if (!customer.password) {
			throw new ApiException('Password required', { status: HttpStatus.BadRequest });
		}

		this.customer.password = bcrypt.hashSync(customer.password, 10);

		if (customer.metadata) {
			if (customer.metadata.address) {
				const { street, city, state, country, postcode } = customer.metadata.address;

				this.address.street = street;
				this.address.city = city;
				this.address.state = state;
				this.address.postcode = postcode;
				this.address.country = country;

				this.metadata.address = this.address;
			}

			this.customer.metadata = this.metadata;
		}

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
				.getBody()
				.database
				.prepare(sql)
				.bind(
					this.customer.firstName,
					this.customer.lastName,
					this.customer.email,
					this.customer.password,
					this.customer.role,
					this.customer.metadata ? JSON.stringify(this.customer.metadata) : '{}',
					this.customer.email
				)
				.run();

			if (meta.rows_written === 0) {
				throw new ApiException('Customer already exist', { status: HttpStatus.BadRequest });
			}

			const data = results[0];
			const response = Utils.mapToObject(data, Customer);

			return Response.json(response.object, { status: HttpStatus.OK });
		} catch (error) {
			if (error instanceof ApiException) throw error;
			throw new ApiException('Internal server error', { cause: error });
		}
	}
}
