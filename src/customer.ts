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

	/**
	 * Below are for React JS field.
	 */
	set firstName(value) {
		this._firstName = value;
	}
	get firstName() {
		return this._firstName;
	}

	set lastName(value) {
		this._lastName = value;
	}
	get lastName() {
		return this._lastName;
	}
	set email(value) {
		this._email = value;
	}
	get email() {
		return this._email;
	}

	set password(value) {
		this._password = value;
	}
	get password() {
		return this._password;
	}

	set createdAt(value) {
		this._createdAt = value;
	}
	get createdAt() {
		return this._createdAt;
	}

	set updatedAt(value) {
		this._updatedAt = value;
	}
	get updatedAt() {
		return this._updatedAt;
	}

	set dynamicEntity(value) {
		this._dynamicEntity = value;
	}
	get dynamicEntity() {
		return this._dynamicEntity;
	}

	/**
	 * Below for database field
	 */
	set first_name(value) {
		this._firstName = value;
	}
	get first_name() {
		return this._firstName;
	}

	set last_name(value) {
		this._lastName = value;
	}
	get last_name() {
		return this._lastName;
	}

	set password_hash(value) {
		this._password = value;
	}
	get password_hash() {
		return this._password;
	}

	set created_at(value) {
		this._createdAt = value;
	}
	get created_at() {
		return this._createdAt;
	}

	set updated_at(value) {
		this._updatedAt = value;
	}
	get updated_at() {
		return this._updatedAt;
	}

	set dynamic_entity(value: string | null) {
		try {
			this._dynamicEntity = value ? JSON.parse(value) : {};
		} catch (e) {
			this._dynamicEntity = {};
		}
	}
	get dynamic_entity() {
		return JSON.stringify(this._dynamicEntity);
	}

	/**
	 * Convert database field name type to front end field name type
	 */
	toJSON() {
		return {
			firstName: this._firstName,
			lastName: this._lastName,
			email: this._email,
			dynamicEntity: this._dynamicEntity,
			createdAt: this._createdAt,
			updatedAt: this._updatedAt,
		};
	}

	validateObject() {
		if (isEmpty(this._firstName)) {
			return Response.json('firstName required', { status: 400 });
		}

		if (isEmpty(this._lastName)) {
			return Response.json('lastName required', { status: 400 });
		}

		if (isEmpty(this._email)) {
			return Response.json('email required', { status: 400 });
		}

		if (isEmpty(this._password)) {
			return Response.json('password required', { status: 400 });
		}
	}
}
