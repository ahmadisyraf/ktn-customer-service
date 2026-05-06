import JsonUtils from '../common/json-utils';

export type AddressState = {
	street?: string;
	city?: string;
	state?: string;
	postcode?: string;
	country?: string;
}

export default class Address {
	public readonly street: string | undefined;
	public readonly city: string | undefined;
	public readonly state: string | undefined;
	public readonly postcode: string | undefined;
	public readonly country: string | undefined;

	constructor(addressState?: AddressState) {
		const state = addressState ? addressState : {};
		this.street = state.street || undefined;
		this.city = state.city || undefined;
		this.postcode = state.postcode || undefined;
		this.country = state.country || undefined;
		this.state = state.state || undefined;
	}

	public static keys(): readonly string[] {
		return Object.keys(new this()) as readonly string[];
	}

	public static from(address: Record<string, any>) {
		JsonUtils.validateObject(address, Address);
		return this.newAddressBuilder()
			.setStreet(address.street ?? undefined)
			.setCity(address.city ?? undefined)
			.setState(address.state ?? undefined)
			.setPostcode(address.postcode ?? undefined)
			.setCountry(address.country ?? undefined)
			.build();
	}

	public static newAddressBuilder() {
		return new this.AddressBuilder();
	}

	public static AddressBuilder = class {
		private state: AddressState = {
			street: undefined,
			city: undefined,
			state: undefined,
			postcode: undefined,
			country: undefined
		};

		public setStreet(street: string) {
			this.state.street = street;
			return this;
		}

		public setCity(city: string) {
			this.state.city = city;
			return this;
		}

		public setState(state: string) {
			this.state.state = state;
			return this;
		}

		public setPostcode(postcode: string) {
			this.state.postcode = postcode;
			return this;
		}

		public setCountry(country: string) {
			this.state.country = country;
			return this;
		}

		public build() {
			return new Address(this.state);
		}
	};
}
