import APIGetBodyResponseBundle from '../bundle/ApiGetBodyResponseBundle';

export default class Api {
	private database: D1Database | undefined;
	private cache: KVNamespace | undefined;

	public getBody(): APIGetBodyResponseBundle {
		return new APIGetBodyResponseBundle(this.database, this.cache);
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
