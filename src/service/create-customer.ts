import Customer from '../model/customer';
import Api from './api';
import bcrypt from 'bcryptjs';
import Address from '../model/address';
import Metadata from '../model/metadata';
import { HttpStatus } from '../http-status';

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
			throw new Error('Customer required');
		}

		this.customer.firstName = customer.firstName;
		this.customer.lastName = customer.lastName;

		if (customer.email.includes("@") == false) {
			throw new Error("Invalid email address");
		}

		this.customer.email = customer.email;
		this.customer.role = customer.role;

		if (!customer.password) {
			throw new Error('Password is required');
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
			throw new Error('Missing customer information');
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
			const { results } = await this.api
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
				.run<Customer>();

			const response = Object.assign(new Customer(), results[0]);

			return Response.json(response.getBody(), { status: HttpStatus.OK });
		} catch (error) {
			throw new Error('Failed to create the customer', { cause: error });
		}
	}
}
