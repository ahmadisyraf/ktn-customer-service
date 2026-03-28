import Customer from './customer';
import { HttpStatus } from './httpStatus';
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

		if (!gatewaySecret) {
			return Response.json('Fobidden', { status: HttpStatus.Forbidden });
		}

		if (gatewaySecret) {
			if (gatewaySecret !== env.GATEWAY_SECRET_KEY) {
				return Response.json('Fobidden', { status: HttpStatus.Forbidden });
			}
			pathname = pathname.replace('/api/customer', '');
		}

		if (pathname === '/getCustomerByEmail' && request.method == 'GET') {
			const email = searchParams.get('email');
			const includePassword = searchParams.get('includePassword');

			if (!email) {
				return Response.json('Email required!', { status: HttpStatus.BadRequest });
			}

			if (!email.includes('@')) {
				return Response.json('Invalid email!', { status: HttpStatus.BadRequest });
			}

			try {
				const customerService = new CustomerService(env.DB);
				const response = await customerService.findCustomerByEmail(email, includePassword);

				return Response.json(response, { status: HttpStatus.OK });
			} catch (error) {
				return Response.json(error, { status: HttpStatus.InternalServerError});
			}

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

			try {
				const customerService = new CustomerService(env.DB);
				const response = await customerService.findAllCustomer({ pagination, sort });

				return Response.json(response, { status: HttpStatus.OK });
			} catch (error) {
				return Response.json(error, { status: HttpStatus.InternalServerError });
			}
		} else if (pathname == '/createCustomer' && request.method == 'POST') {
			const body = await request.json();

			let customer = new Customer();
			customer.fromJSON(body);

			try {
				customer.validateObject();
			} catch (error) {
				return Response.json(error, { status: HttpStatus.BadRequest });
			}

			customer.password = await bcyrpt.hash(customer.password, 10);
			customer.role = 'USER';

			try {
				const customerService = new CustomerService(env.DB);
				const response = await customerService.saveCustomer(customer);

				return Response.json(response, { status: HttpStatus.Created });
			} catch (error) {
				return Response.json(error, { status: HttpStatus.InternalServerError });
			}
		} else if (pathname == '/updateCustomer' && request.method == 'PATCH') {
			const body = await request.json();

			let customer = new Customer();
			customer.fromJSON(body);


			try {
				customer.validateObject();
			} catch (error) {
				return Response.json(error, { status: HttpStatus.BadRequest });
			}

			customer.password = await bcyrpt.hash(customer.password, 10);

			try {
				const customerService = new CustomerService(env.DB);
				const response = await customerService.updateCustomer(customer);

				return Response.json(response, { status: HttpStatus.OK });
			} catch (error) {
				return Response.json(error, { status: HttpStatus.InternalServerError });
			}
		} else if (pathname == '/changeCustomerRole' && request.method == 'PATCH') {
		}

		return Response.json('Not found', { status: HttpStatus.NotFound });
	},
} satisfies ExportedHandler<Env>;
