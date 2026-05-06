import Address from './address';

export type MetadataState = {
	address?: Address;
}

export default class Metadata {
	public readonly address: Address | undefined;

	constructor(state: MetadataState) {
		this.address = state.address;
	}

	public static from(metadata: Record<string, any>) {
		return this.newMetadataBuilder()
			.setAddress(metadata.address ?? undefined)
			.build();
	}

	public static newMetadataBuilder() {
		return new this.MetadataBuilder();
	}

	public static MetadataBuilder = class {
		private state: Partial<MetadataState> = {};

		public setAddress(address: Record<string, any>) {
			if (address) {
				this.state.address = Address.from(address);
			}
			return this;
		}

		public build() {
			return new Metadata(this.state as MetadataState);
		}
	};
}
