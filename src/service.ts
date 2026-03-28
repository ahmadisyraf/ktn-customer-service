import Customer from './customer';
import { GetAllCustomerRequest } from './interface';

export default class CustomerService {
	private database: D1Database;

	constructor(database: D1Database) {
		this.database = database;
	}

	async saveCustomer(customer: Customer) {
		const sql = `INSERT INTO customers (
                                            first_name, 
                                            last_name, 
                                            email, 
                                            password_hash
                                            )
                    SELECT ?, ?, ?, ?
                    WHERE NOT EXISTS (SELECT 1 FROM customers WHERE email = ? LIMIT 1)`;

		try {
			const result = await this.database
				.prepare(sql)
				.bind(customer.firstName, customer.lastName, customer.email, customer.password, customer.email)
				.run();

			return result.success && result.meta.rows_written > 0;
		} catch (error) {
			throw new Error('Internal server error', { cause: error });
		}
	}

	async findCustomerByEmail(email: string, includePassword: string | null) {
		const sql = 'SELECT * FROM customers WHERE email = ? LIMIT 1';
		try {
			let result = await this.database.prepare(sql).bind(email).first();

			if (!result) {
				return {};
			}

			const customer = new Customer();
			customer.fromDB(result);

			if (includePassword && includePassword == 'true') {
				return customer.toJSON().includePassword();
			}

			return customer.toJSON().excludePassword();
		} catch (error) {
			throw new Error('Internal server error', { cause: error });
		}
	}

	async updateCustomer(customer: Customer) {
		const sql = `UPDATE customers SET 
						first_name = ?, 
            			last_name = ?, 
            			password_hash = ?, 
            			updated_at = CURRENT_TIMESTAMP
					WHERE email = ?`;

		try {
			const result = await this.database.prepare(sql).bind(customer.firstName, customer.lastName, customer.password, customer.email).run();

			return result.success && result.meta.changes > 0;
		} catch (error) {
			throw new Error('Internal server error during update', { cause: error });
		}
	}

	async findAllCustomer({ pagination, sort }: GetAllCustomerRequest) {
		const { page, limit } = pagination;

		const offset = (page - 1) * limit;
		const sql = `SELECT * FROM customers ORDER BY ${sort.column} ${sort.direction} LIMIT ? OFFSET ?`;

		try {
			const { results } = await this.database.prepare(sql).bind(limit, offset).all();

			if (!results || results.length === 0) {
				return {
					data: [],
					page,
					limit,
				};
			}

			const customers = results.map((result) => {
				const customer = new Customer();
				customer.fromDB(result);

				return customer.toJSON().excludePassword();
			});

			return {
				data: customers,
				page,
				limit,
			};
		} catch (error) {
			throw new Error('Internal server error', { cause: error });
		}
	}

	// TODO: set permission for role
	async setPermission(role: Role, permission: string): boolean {
		const sql = '';

		try {
			return (await this.database.prepare(sql).bind().all()).success;
		} catch (error) {
			throw new Error('Internal server error', { cause: error});
		}
	}

	// TODO: remove permission. Do not allow to update permission
	async removePermission(role: Role, permission: string) {
	}

	// TODO: display all permission
	async allPermission(){}
}
