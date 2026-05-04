import Api from './api';
import Customer from '../model/customer';
import { HttpStatus } from '../http-status';
import ApiException from '../common/api-exception';

export default class LoadCustomer {
	private api: Api;
	private email: string | undefined | null;

	constructor(api: Api) {
		this.api = api;
	}

	public setEmail(email: string | null): this {
		if (!email) {
			throw new ApiException('Email not found', { status: HttpStatus.BadRequest });
		}
		this.email = email;

		return this;
	}

	public async doRequest(): Promise<Response> {
		if (!this.email) {
			throw new ApiException('Email not found', { status: HttpStatus.BadRequest });
		}

		if (!this.email.includes('@')) {
			throw new ApiException('Invalid email address format', { status: HttpStatus.BadRequest });
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

			return Response.json(response ? response.object : {}, { status: HttpStatus.OK });
		} catch (error) {
			throw new ApiException('Internal server error', { cause: error });
		}
	}
}
