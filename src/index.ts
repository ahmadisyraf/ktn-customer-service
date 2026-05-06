import CustomerService from './service/customer-service';
import Api from './service/api';
import { HttpStatus } from './http-status';
import ApiException from './common/api-exception';

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

		try {
			const api = new Api();
			api.setDatabase(env.DB);

			const service = new CustomerService(api);

			if (pathname === '/getCustomerByEmail' && request.method == 'GET') {
				const email = searchParams.get('email');

				return await service
					.loadCustomer()
					.setEmail(email)
					.doRequest();
			} else if (pathname == '/createCustomer' && request.method == 'POST') {
				const body = await request.json<any>();

				return await service
					.createCustomer()
					.setCustomer(body)
					.doRequest();
			} else if (pathname === '/updateCustomer' && request.method == 'PATCH') {
				const body = await request.json<any>();

				return await service
					.updateCustomer()
					.setCustomer(body)
					.doRequest();
			}
		} catch (error) {
			if (error instanceof ApiException) {
				return Response.json({
					name: error.name,
					message: error.message,
					status: error.status,
					stack: error.stack
				}, { status: error.status });
			}
		}

		return Response.json('Not found', { status: HttpStatus.NotFound });
	}
} satisfies ExportedHandler<Env>;
