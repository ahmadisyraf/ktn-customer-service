import Customer from './model/customer';
import CustomerService from './service/customer-service';
import Api from './service/api';
import { HttpStatus } from './http-status';
import bcrypt from 'bcryptjs';

export interface Env {
	DB: D1Database;
	GATEWAY_SECRET_KEY: string;
}

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const gatewaySecret = request.headers.get('x-gateway-secret');

		if ((!gatewaySecret) || (gatewaySecret && gatewaySecret !== env.GATEWAY_SECRET_KEY)) {
			return Response.json('Forbidden', { status: HttpStatus.Forbidden });
		}

		let { pathname, searchParams } = new URL(request.url);
		pathname = pathname.replace('/api/customer', '');

		const api = new Api();
		api.setDatabase(env.DB);

		const service = new CustomerService(api);
		const customer = new Customer();

		if (pathname === '/getCustomerByEmail' && request.method == 'GET') {
			const email = searchParams.get('email');

			try {
				const response = await service
					.loadCustomer()
					.setEmail(email)
					.doRequest();

				return Response.json(response ? response.getBody() : {}, { status: HttpStatus.OK });
			} catch (error) {
				console.error(error);
				return Response.json(error, { status: HttpStatus.InternalServerError });
			}
		} else if (pathname == '/createCustomer' && request.method == 'POST') {
			const body = await request.json<any>();

			customer.firstName = body.firstName;
			customer.lastName = body.lastName;
			customer.password = bcrypt.hashSync(body.password, 10);
			customer.email = body.email;
			customer.role = body.role;
			customer.metadata = body.metadata;

			try {
				const response = await service
					.createCustomer()
					.setCustomer(customer)
					.doRequest();

				return Response.json(response.getBody(), { status: HttpStatus.OK });
			} catch (error) {
				console.log(error);
				return Response.json(error, { status: HttpStatus.InternalServerError });
			}
		} else if (pathname === '/updateCustomer' && request.method == 'PATCH') {
			const body = await request.json<any>();

			customer.firstName = body.firstName;
			customer.lastName = body.lastName;
			customer.email = body.email;

			try {
				const response = await service
					.updateCustomer()
					.setCustomer(customer)
					.doRequest();

				return Response.json(response.getBody(), { status: HttpStatus.OK });
			} catch (error) {
				console.log(error);
				return Response.json(error, { status: HttpStatus.InternalServerError });
			}
		}

		return Response.json('Not found', { status: HttpStatus.NotFound });
	}
} satisfies ExportedHandler<Env>;
