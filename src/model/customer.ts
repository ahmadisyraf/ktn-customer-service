import BaseModel from './base-model';
import FieldNotExistException from '../common/field-not-exist-exception';

export default class Customer extends BaseModel {
	public firstName: string = '';
	public lastName: string = '';
	public email: string = '';
	public password: string | undefined;
	public role: string = '';

	constructor() {
		super();
	}

	public static keys(): readonly string[] {
		return ['firstName', 'lastName', 'email', 'password', 'role'] as const;
	}

	public get object(): Record<string, any> {
		return {
			firstName: this.firstName,
			lastName: this.lastName,
			email: this.email,
			password: this.password,
			role: this.role,
			...typeof this.metadata === 'string' ? JSON.parse(this.metadata) : this.metadata,
			updatedAt: this.updatedAt,
			createdAt: this.createdAt
		};
	}
}
