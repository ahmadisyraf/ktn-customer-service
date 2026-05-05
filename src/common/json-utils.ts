export default class JsonUtils {

	public static toJSON(object: Record<string, any>): string {
		return JSON.stringify(object)
	}


	public static mapToObject<T>(data: Record<string, any>, target: new () => T) {
		const instance = new target();
		if (data) {
			Object.assign(instance as object, data);
		}
		return instance;
	}

}
