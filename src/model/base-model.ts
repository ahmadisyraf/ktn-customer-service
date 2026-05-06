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

	constructor(baseState?: BaseState) {
		const state = baseState ? baseState : {};
		this.updatedAt = state.updatedAt || undefined;
		this.createdAt = state.createdAt || undefined;
		this.metadata = state.metadata || undefined;
	}
}
