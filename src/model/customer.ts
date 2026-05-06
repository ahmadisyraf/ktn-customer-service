import BaseModel, { BaseState } from './base-model';
import JsonUtils from '../common/json-utils';
import bcrypt from 'bcryptjs';
import ApiException from '../common/api-exception';
import { HttpStatus } from '../http-status';
import Metadata from './metadata';
import FieldException from '../common/field-exception';

export type CustomerState = BaseState & {
	firstName: string,
	lastName: string,
	email: string,
	password?: string,
	role: string,
}

export default class Customer extends BaseModel {
	public readonly firstName: string;
	public readonly lastName: string;
	public readonly email: string;
	public readonly password: string | undefined;
	public readonly role: string;

	constructor(builder?: CustomerState) {
		super(builder);
		const state = builder || {} as CustomerState;

		this.firstName = state.firstName || '';
		this.lastName = state.lastName || '';
		this.email = state.email || '';
		this.password = state.password || undefined;
		this.role = state.role || '';
	}

	public static keys(): readonly string[] {
		return ['firstName', 'lastName', 'email', 'password', 'role', 'metadata', 'updatedAt', 'createdAt'] as const;
	}

	public static from(customer: Record<string, any>, { excludePassword = true }) {
		JsonUtils.validateObject(customer, Customer);
		const metadata = typeof customer.metadata === 'string' ? JsonUtils.fromJSON(customer.metadata) : customer.metadata;
		const builder = this.newCustomerBuilder()
			.setFirstName(customer.firstName)
			.setLastName(customer.lastName)
			.setEmail(customer.email)
			.setRole(customer.role)
			.setMetadata(Metadata.from(metadata))
			.setCreatedAt(customer.createdAt)
			.setUpdatedAt(customer.updatedAt);

		if (!excludePassword) { // Usually for get request
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
		private state: CustomerState = {
			firstName: '',
			lastName: '',
			email: '',
			password: undefined,
			role: '',
			updatedAt: undefined,
			createdAt: undefined
		};

		public setFirstName(firstName: string) {
			this.state.firstName = firstName;
			return this;
		}

		public setLastName(lastName: string) {
			this.state.lastName = lastName;
			return this;
		}

		public setEmail(email: string) {
			if (!email.includes('@')) {
				throw new ApiException('Invalid email address', { status: HttpStatus.BadRequest });
			}
			this.state.email = email;
			return this;
		}

		public setPassword(password: string) {
			this.state.password = bcrypt.hashSync(password, 10);
			return this;
		}

		public setRole(role: string) {
			this.state.role = role;
			return this;
		}

		public setUpdatedAt(updatedAt: string | undefined) {
			this.state.updatedAt = updatedAt;
			return this;
		}

		public setCreatedAt(createdAt: string | undefined) {
			this.state.createdAt = createdAt;
			return this;
		}

		public setMetadata(metadata?: Metadata) {
			this.state.metadata = metadata;
			return this;
		}

		public build() {
			return new Customer(this.state);
		}
	};
}
