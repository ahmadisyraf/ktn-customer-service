import Api from './api';
import Customer from '../model/customer';
import { HttpStatus } from '../http-status';
import ApiException from '../common/api-exception';
import JsonUtils from '../common/./json-utils';
import FieldException from '../common/field-exception';

export default class LoadCustomer {
	private api: Api;
	private email: string | undefined | null;

	constructor(api: Api) {
		this.api = api;
	}

	public setEmail(email: string | null): this {
		if (!email) {
			throw new FieldException('email');
		}
		this.email = email;

		return this;
	}

	public async doRequest(): Promise<Response> {
		if (!this.email) {
			throw new FieldException('email');
		}

		if (!this.email.includes('@')) {
			throw new FieldException('email (invalid email)');
		}

		const sql = `SELECT firstName,
												lastName,
												email,
												role,
												metadata,
												updatedAt,
												createdAt
								 FROM customers
								 WHERE email = ? LIMIT 1`;

		try {
			const result = await this.api
				.getBody()
				.database
				.prepare(sql)
				.bind(this.email)
				.first();

			let response;
			if (result) {
				response = Customer.from(result, { excludePassword: true });
			}

			return Response.json(response ? response : {}, { status: HttpStatus.OK });
		} catch (error) {
			if (error instanceof ApiException) {
				throw error;
			}
			throw new ApiException('Internal server error', { cause: error });
		}
	}
}
