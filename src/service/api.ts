import ApiResponseBundle from '../bundle/api-response-bundle';

export default class Api {
	private database: D1Database | undefined;
	private cache: KVNamespace | undefined;

	public getBody(): ApiResponseBundle {
		return new ApiResponseBundle(this.database, this.cache);
	}

	public setCache(cache: KVNamespace): this {
		this.cache = cache;

		return this;
	}

	public setDatabase(database: D1Database): this {
		this.database = database;

		return this;
	}
}
