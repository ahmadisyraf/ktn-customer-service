import Customer from './customer';
import { GetAllCustomerRequest, PaginationType, SortType } from './interface';
import CustomerService from './service';
import bcyrpt from 'bcryptjs';

export interface Env {
	DB: D1Database;
	GATEWAY_SECRET_KEY: string;
}

export default {
	async fetch(request, env, ctx): Promise<Response> {
		let { pathname, searchParams } = new URL(request.url);
		const gatewaySecret = request.headers.get('x-gateway-secret');

		// Uncomment this if want to connect directly with customer service
		if (!gatewaySecret) {
			return Response.json('Unauthorized', { status: 401 });
		}

		if (gatewaySecret) {
			if (gatewaySecret !== env.GATEWAY_SECRET_KEY) {
				return Response.json('Unauthorized', { status: 401 });
			}
			pathname = pathname.replace('/api/customer', '');
		}

		if (pathname === '/getCustomerByEmail' && request.method == 'GET') {
			const email = searchParams.get('email');
			if (!email) {
				return Response.json('Email required!', { status: 400 });
			}

			if (!email.includes('@')) {
				return Response.json('Invalid email!', { status: 400 });
			}

			const authentication = new CustomerService(env.DB);
			const response = await authentication.findCustomerByEmail(email);

			return Response.json(response, { status: 200 });
		} else if (pathname === '/getAllCustomer' && request.method == 'POST') {
			type GetAllCustomerRequest_ = Omit<GetAllCustomerRequest, 'pagination'> & {
				pagination: PaginationType | undefined;
			};

			let body: GetAllCustomerRequest_ | undefined;

			try {
				body = await request.json();
			} catch {
				body = undefined;
			}

			let pagination: PaginationType = {
				page: 1,
				limit: 10,
			};

			let sort: SortType = {
				column: 'created_at',
				direction: 'asc',
			};

			if (body && body.pagination) {
				if (body.pagination.page > 0) pagination.page = body.pagination.page;
				if (body.pagination.limit > 0) pagination.limit = body.pagination.limit;
			}

			if (body && body.sort) {
				if (body.sort.column) sort.column = body.sort.column;
				if (body.sort.direction) sort.direction = body.sort.direction;
			}

			const authentication = new CustomerService(env.DB);
			const response = await authentication.findAllCustomer({ pagination, sort });

			return Response.json(response, { status: 200 });
		} else if (pathname == '/createCustomer' && request.method == 'POST') {
			const body = await request.json();

			let customer = new Customer();
			customer.fromJSON(body);

			const validation = customer.validateObject();
			if (validation) {
				return validation; // Return error response
			}

			customer.password = await bcyrpt.hash(customer.password, 10);

			const authentication = new CustomerService(env.DB);
			const response = await authentication.saveCustomer(customer);

			return Response.json(response, { status: 201 });
		} else if (pathname == '/updateCustomer' && request.method == 'PATCH') {
			const body = await request.json();

			let customer = new Customer();
			customer.fromJSON(body);

			const validation = customer.validateObject();
			if (validation) {
				return validation; // Return response
			}

			customer.password = await bcyrpt.hash(customer.password, 10);

			const authentication = new CustomerService(env.DB);
			const response = await authentication.updateCustomer(customer);

			return Response.json(response, { status: 200 });
		}

		return Response.json('Not found', { status: 404 });
	},
} satisfies ExportedHandler<Env>;
