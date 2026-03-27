import { HttpStatus } from './httpStatus';
import { CustomerBase, CustomerBaseWithoutPassword, CustomerToJSON } from './interface';
import { isEmpty } from './utils';

export default class Customer {
	private _firstName: string = '';
	private _lastName: string = '';
	private _email: string = '';
	private _password: string = '';
	private _dynamicEntity: Record<string, any> | undefined;
	private _createdAt: string | undefined;
	private _updatedAt: string | undefined;

	constructor() {}

	get firstName() {
		return this._firstName;
	}
	get lastName() {
		return this._lastName;
	}
	get email() {
		return this._email;
	}
	get password() {
		return this._password;
	}
	set password(value: string) {
		this._password = value; // Only password can be set. Hashing purpose
	}
	get createdAt() {
		return this._createdAt;
	}
	get updatedAt() {
		return this._updatedAt;
	}
	get dynamicEntity() {
		return this._dynamicEntity;
	}

	fromDB(row: any): this {
		this._firstName = row.first_name ?? '';
		this._lastName = row.last_name ?? '';
		this._email = row.email ?? '';
		this._password = row.password_hash ?? '';

		try {
			this._dynamicEntity = typeof row.dynamic_entity === 'string' ? JSON.parse(row.dynamic_entity) : row.dynamic_entity;
		} catch {
			this._dynamicEntity = undefined;
		}

		this._createdAt = row.created_at ?? undefined;
		this._updatedAt = row.updated_at ?? undefined;

		return this;
	}

	fromJSON(data: any): this {
		this._firstName = data.firstName || '';
		this._lastName = data.lastName || '';
		this._email = data.email || '';
		this._password = data.password || '';
		this._dynamicEntity = data.dynamicEntity;
		return this;
	}

	toJSON(): CustomerToJSON {
		let defaultObj = {
			firstName: this._firstName,
			lastName: this._lastName,
			email: this._email,
			password: this._password,
			dynamicEntity: this._dynamicEntity,
			createdAt: this._createdAt,
			updatedAt: this._updatedAt,
		};

		return {
			includePassword(): CustomerBase {
				return defaultObj;
			},
			excludePassword(): CustomerBaseWithoutPassword {
				let defaultObjClone = JSON.parse(JSON.stringify(defaultObj));

				delete defaultObjClone.password;

				return defaultObjClone;
			},
		};
	}

	validateObject() {
		if (isEmpty(this._firstName)) {
			throw new Error('First name required!'); 
		} 
		if (isEmpty(this._lastName)) {
			throw new Error('Last name required!');
		}
		if (isEmpty(this._email)) {
			throw new Error('Email required!');
		}
	}
}
