import Metadata from './metadata';

export type BaseState = {
	updatedAt?: string;
	createdAt?: string;
	metadata?: Metadata;
}

export default class BaseModel {
	public readonly updatedAt: string | undefined;
	public readonly createdAt: string | undefined;
	public readonly metadata: Metadata | undefined;

	constructor(state: BaseState) {
		this.updatedAt = state.updatedAt;
		this.createdAt = state.createdAt;
		this.metadata = state.metadata;
	}
}
