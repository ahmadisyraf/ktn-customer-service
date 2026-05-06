import Address from './address';
import JsonUtils from '../common/json-utils';

export type MetadataState = {
	address?: Address;
}

export default class Metadata {
	public readonly address: Address | undefined;

	constructor(metadataState?: MetadataState) {
		const state = metadataState ? metadataState : {};
		this.address = state.address || undefined;
	}

	public static keys(): readonly string[] {
		return Object.keys(new this()) as readonly string[];
	}

	public static from(metadata: Record<string, any>) {
		JsonUtils.validateObject(metadata, Metadata);
		return this.newMetadataBuilder()
			.setAddress(Address.from(metadata.address))
			.build();
	}

	public static newMetadataBuilder() {
		return new this.MetadataBuilder();
	}

	public static MetadataBuilder = class {
		private state: MetadataState = {
			address: undefined
		};

		public setAddress(address: Address) {
			this.state.address = address;
			return this;
		}

		public build() {
			return new Metadata(this.state);
		}
	};
}
