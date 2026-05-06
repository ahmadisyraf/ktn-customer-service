import JsonUtils from '../common/json-utils';

export type AddressState = {
	street: string | undefined;
	city: string | undefined;
	state: string | undefined;
	postcode: string | undefined;
	country: string | undefined;
}

export default class Address {
	public readonly street: string | undefined;
	public readonly city: string | undefined;
	public readonly state: string | undefined;
	public readonly postcode: string | undefined;
	public readonly country: string | undefined;

	constructor(state: AddressState) {
		this.street = state.street;
		this.city = state.city;
		this.postcode = state.postcode;
		this.country = state.country;
		this.state = state.state;
	}

	public static from(address: Record<string, any>) {
		return this.newAddressBuilder()
			.setStreet(address.street)
			.setCity(address.city)
			.setState(address.state)
			.setPostcode(address.postcode)
			.setCountry(address.country)
			.build();
	}

	public static newAddressBuilder() {
		return new this.AddressBuilder();
	}

	public static AddressBuilder = class {
		private state: Partial<AddressState> = {};

		public setStreet(street: string | undefined): this {
			this.state.street = street;
			return this;
		}

		public setCity(city: string | undefined): this {
			this.state.city = city;
			return this;
		}

		public setState(state: string | undefined): this {
			this.state.state = state;
			return this;
		}

		public setPostcode(postcode: string | undefined): this {
			this.state.postcode = postcode;
			return this;
		}

		public setCountry(country: string | undefined): this {
			this.state.country = country;
			return this;
		}

		public build() {
			return new Address(this.state as AddressState);
		}
	};
}
