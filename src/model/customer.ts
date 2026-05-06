import BaseModel, { BaseState } from './base-model';
import JsonUtils from '../common/json-utils';
import bcrypt from 'bcryptjs';
import ApiException from '../exception/api-exception';
import { HttpStatus } from '../http-status';
import Metadata from './metadata';
import FieldException from '../exception/field-exception';

export type CustomerState = BaseState & {
	firstName: string,
	lastName: string,
	email: string,
	password?: string,
	role: string,
}

export type CustomerOptions = {
	excludePassword: boolean;
}

export default class Customer extends BaseModel {
	public readonly firstName: string;
	public readonly lastName: string;
	public readonly email: string;
	public readonly password: string | undefined;
	public readonly role: string;

	constructor(state: CustomerState) {
		super(state);
		this.firstName = state.firstName;
		this.lastName = state.lastName;
		this.email = state.email;
		this.password = state.password;
		this.role = state.role;
	}

	public static from(customer: Record<string, any>, options?: CustomerOptions): Customer {
		const metadata = typeof customer.metadata === 'string' ? JsonUtils.fromJSON(customer.metadata) : customer.metadata;
		const builder = this.newCustomerBuilder()
			.setFirstName(customer.firstName)
			.setLastName(customer.lastName)
			.setEmail(customer.email)
			.setRole(customer.role)
			.setMetadata(Metadata.from(metadata))
			.setCreatedAt(customer.createdAt)
			.setUpdatedAt(customer.updatedAt);

		if (!options || options && !options.excludePassword) {
			if (!customer.password) {
				throw new FieldException('password');
			}
			builder.setPassword(customer.password);
		}

		return builder.build();
	}

	public static newCustomerBuilder() {
		return new this.CustomerBuilder();
	}

	private static CustomerBuilder = class {
		private state: Partial<CustomerState> = {};

		public setFirstName(firstName: string): this {
			if (!firstName) {
				throw new FieldException('firstName');
			}
			this.state.firstName = firstName;
			return this;
		}

		public setLastName(lastName: string): this {
			if (!lastName) {
				throw new FieldException('lastName');
			}
			this.state.lastName = lastName;
			return this;
		}

		public setEmail(email: string): this {
			if (!email) {
				throw new FieldException('email');
			}
			if (!email.includes('@')) {
				throw new ApiException('Invalid email address', { status: HttpStatus.BadRequest });
			}
			this.state.email = email;
			return this;
		}

		public setPassword(password: string): this {
			this.state.password = bcrypt.hashSync(password, 10);
			return this;
		}

		public setRole(role: string): this {
			if (!role) {
				throw new FieldException('role');
			}
			this.state.role = role;
			return this;
		}

		public setUpdatedAt(updatedAt: string): this {
			this.state.updatedAt = updatedAt;
			return this;
		}

		public setCreatedAt(createdAt: string): this {
			this.state.createdAt = createdAt;
			return this;
		}

		public setMetadata(metadata: Metadata | undefined): this {
			if (!metadata) {
				throw new FieldException('metadata');
			}
			this.state.metadata = metadata;
			return this;
		}

		public build() {
			return new Customer(this.state as CustomerState);
		}
	};
}
