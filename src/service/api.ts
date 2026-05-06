import ApiException from '../exception/api-exception';

export type ApiState = {
	database: D1Database;
}

export default class Api {
	public readonly database: D1Database;

	constructor(state: ApiState) {
		this.database = state.database;
	}

	public static newApiBuilder() {
		return new this.ApiBuilder();
	}

	public static ApiBuilder = class {
		private state: Partial<ApiState> = {};

		public setDatabase(database: D1Database | undefined): this {
			if (!database) {
				throw new ApiException('Unable to find database');
			}
			this.state.database = database;
			return this;
		}

		public build() {
			if (!this.state.database) {
				throw new ApiException('Unable to build api');
			}
			return new Api(this.state as ApiState);
		}
	};

}
