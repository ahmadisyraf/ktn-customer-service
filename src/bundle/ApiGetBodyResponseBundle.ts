export default class APIGetBodyResponseBundle {
	private _database: D1Database | undefined;
	private _cache: KVNamespace | undefined;

	constructor(database: D1Database | undefined, cache: KVNamespace | undefined) {
		this._database = database;
		this._cache = cache;
	}

	public get database() {
		if (!this._database) {
			throw new Error('Missing database');
		}

		return this._database;
	}

	public get cache() {
		if (!this._cache) {
			throw new Error('Missing cache');
		}

		return this._cache;
	}
}
